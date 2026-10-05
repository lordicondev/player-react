import { BaseTrigger, defineElement, LordIcon, type TriggerContext } from '../src/index.ts';
import { mount } from './mount.tsx';

/** Each click plays the animation the other way. */
class PingPong extends BaseTrigger {
    direction: 1 | -1 = 1;

    constructor(context: TriggerContext) {
        super(context);
        this.listen(this.target, 'click', () => {
            if (!this.player.playing) void this.player.play();
        });
    }

    onComplete() {
        this.direction = this.direction === 1 ? -1 : 1;
        this.player.direction = this.direction;
    }
}

// Once, before the first icon: triggers are registered by name.
defineElement({ triggers: { 'ping-pong': PingPong } });

function Example() {
    return (
        <>
            <h1>A custom trigger</h1>
            <p>
                A trigger of your own is a <code>BaseTrigger</code> registered with{' '}
                <code>defineElement()</code>, then named in <code>trigger</code>. Click the icon.
            </p>
            <LordIcon src="/icons/lock.json" state="morph-unlocked" trigger="ping-pong" />
        </>
    );
}

mount(<Example />);
