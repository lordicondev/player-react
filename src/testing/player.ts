import {
    LordIconElement,
    type IconData,
    type IconState,
    type Player,
    type PlayOptions,
} from '@lordicon/element';

/** A minimal icon: enough for the element, which hands it to the player. */
export function iconData(): IconData {
    return { v: '5.12.0', fr: 30, ip: 0, op: 60, w: 100, h: 100, layers: [], markers: [] };
}

const STATES = [
    { name: 'in-reveal', time: 0, duration: 30, params: [], default: false },
    { name: 'hover-jump', time: 40, duration: 30, params: [], default: true },
] as IconState[];

/**
 * A stand-in for the Lordicon player: records what it is asked to do, and becomes ready
 * when the test says so.
 */
export class StubPlayer extends EventTarget {
    calls: string[] = [];
    data: unknown;
    ready = false;
    playing = false;
    state: string | null = null;
    speed = 1;
    colors = {};
    states = STATES;
    readonly readyPromise: Promise<boolean>;
    #resolve!: (ready: boolean) => void;

    constructor(data: unknown) {
        super();
        this.data = data;
        this.readyPromise = new Promise((resolve) => (this.#resolve = resolve));
    }

    init(): void {
        this.calls.push('init');
    }

    destroy(): void {
        this.calls.push('destroy');
        this.#resolve(false);
    }

    becomeReady(): void {
        this.ready = true;
        this.#resolve(true);
        this.dispatchEvent(new Event('ready'));
    }

    complete(): void {
        this.playing = false;
        this.dispatchEvent(
            new CustomEvent('complete', {
                detail: { segment: [40, 71], direction: 1, state: this.state },
            }),
        );
    }

    play(options: PlayOptions = {}): Promise<boolean> {
        this.calls.push(options.state ? `play:${options.state}` : 'play');
        this.playing = true;
        return Promise.resolve(true);
    }

    pause(): void {
        this.calls.push('pause');
    }

    stop(): void {
        this.calls.push('stop');
    }

    seek(): void {
        this.calls.push('seek');
    }
}

/** Makes the element create stub players. Returns them as they come, and the undo. */
export function useStubPlayer() {
    const original = LordIconElement.playerFactory;
    const created: StubPlayer[] = [];

    LordIconElement.playerFactory = (_container, data) => {
        const player = new StubPlayer(data);
        created.push(player);
        return player as unknown as Player;
    };

    return {
        created,
        get player(): StubPlayer {
            return created[created.length - 1];
        },
        restore() {
            LordIconElement.playerFactory = original;
        },
    };
}
