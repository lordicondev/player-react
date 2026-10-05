import type { LordIconElement } from '@lordicon/element';
import { act, createRef, useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LordIcon } from './lord-icon.tsx';
import { iconData, useStubPlayer } from './testing/player.ts';
import { render, settle, stubFetch } from './testing/render.tsx';

let stub: ReturnType<typeof useStubPlayer>;
let fetch: ReturnType<typeof stubFetch>;

beforeEach(() => {
    stub = useStubPlayer();
    fetch = stubFetch();
});

afterEach(() => {
    stub.restore();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
});

/** Lets the icon load, then makes it ready. */
async function ready(): Promise<void> {
    await settle();
    await act(async () => stub.player.becomeReady());
    await settle();
}

describe('LordIcon', () => {
    it('renders <lord-icon> with its props as attributes, and children as the placeholder', async () => {
        const { icon } = await render(
            <LordIcon
                src="/lock.json"
                trigger="loop(1000)"
                state="hover-jump"
                target="div"
                colors={{ primary: '#ff5a36', secondary: 'red' }}
                stroke="bold"
                speed={2}
                currentColor
                intro="in-reveal"
                loading="lazy"
                motion="always"
                className="big"
                aria-label="Locked"
            >
                <img alt="" src="/lock.svg" />
            </LordIcon>,
        );

        expect(icon.tagName).toBe('LORD-ICON');
        expect(Object.fromEntries([...icon.attributes].map((a) => [a.name, a.value]))).toEqual({
            src: '/lock.json',
            trigger: 'loop(1000)',
            state: 'hover-jump',
            target: 'div',
            colors: 'primary:#ff5a36,secondary:red',
            stroke: 'bold',
            speed: '2',
            'current-color': '',
            intro: 'in-reveal',
            loading: 'lazy',
            motion: 'always',
            class: 'big',
            'aria-label': 'Locked',
        });
        expect(icon.querySelector('img')).not.toBeNull();
    });

    it('updates the element as props change, and drops what is left out', async () => {
        const view = await render(<LordIcon src="/lock.json" state="in-reveal" currentColor />);
        await view.rerender(<LordIcon src="/lock.json" state="hover-jump" currentColor={false} />);

        expect(view.icon.getAttribute('state')).toBe('hover-jump');
        expect(view.icon.hasAttribute('current-color')).toBe(false);
    });

    it('gives the icon data to the element as a property, without fetching', async () => {
        const data = iconData();
        const { icon } = await render(<LordIcon icon={data} />);
        await ready();

        expect((icon as LordIconElement).icon).toBe(data);
        expect(icon.hasAttribute('icon')).toBe(false);
        expect(stub.created).toHaveLength(1);
        expect(stub.player.data).toBe(data);
        expect(fetch).not.toHaveBeenCalled();
    });

    it('calls the event props with the element’s events', async () => {
        const onReady = vi.fn();
        const onComplete = vi.fn();
        const onTrigger = vi.fn();
        await render(
            <LordIcon
                src="/lock.json"
                trigger="click"
                onReady={onReady}
                onComplete={onComplete}
                onTrigger={onTrigger}
            />,
        );
        await ready();
        expect(onReady).toHaveBeenCalledOnce();
        expect(onTrigger).toHaveBeenCalledOnce();

        stub.player.complete();
        expect(onComplete).toHaveBeenCalledOnce();
        expect(onComplete.mock.calls[0][0].detail.segment).toEqual([40, 71]);
    });

    it('calls onError when the icon cannot load', async () => {
        stubFetch(null, 404);
        const onError = vi.fn();
        await render(<LordIcon src="/missing.json" onError={onError} />);
        await settle();

        expect(onError).toHaveBeenCalledOnce();
        expect(onError.mock.calls[0][0].detail).toBeInstanceOf(Error);
    });

    it('calls the latest handler after a rerender', async () => {
        const first = vi.fn();
        const second = vi.fn();
        const view = await render(<LordIcon src="/lock.json" onComplete={first} />);
        await view.rerender(<LordIcon src="/lock.json" onComplete={second} />);
        await ready();

        stub.player.complete();
        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledOnce();
    });

    it('hands the element to a ref, with its methods', async () => {
        const ref = createRef<LordIconElement>();
        const view = await render(<LordIcon ref={ref} src="/lock.json" />);
        expect(ref.current).toBe(view.icon);

        const played = ref.current!.play({ state: 'in-reveal' });
        await ready();
        await expect(played).resolves.toBe(true);
        expect(stub.player.calls).toContain('play:in-reveal');

        await view.unmount();
        expect(ref.current).toBeNull();
    });

    it('hands the element to a callback ref, and null on unmount', async () => {
        const seen: (LordIconElement | null)[] = [];
        const view = await render(<LordIcon ref={(node) => void seen.push(node)} />);
        await view.unmount();

        expect(seen).toHaveLength(2);
        expect(seen[0]?.tagName).toBe('LORD-ICON');
        expect(seen[1]).toBeNull();
    });

    it('follows a target given as a ref, outside the icon’s ancestors', async () => {
        function Page() {
            const button = useRef<HTMLButtonElement>(null);
            return (
                <>
                    {/* After the icon: its ref fills in later in the same commit. */}
                    <LordIcon src="/lock.json" trigger="click" target={button} />
                    <button ref={button}>Unlock</button>
                </>
            );
        }
        const view = await render(<Page />);
        await ready();

        const icon = view.icon as LordIconElement;
        const button = view.container.querySelector('button')!;
        expect(icon.target).toBe(button);
        expect(icon.hasAttribute('target')).toBe(false);

        button.click();
        expect(stub.player.calls).toContain('play');
    });

    it('unloads the icon when unmounted', async () => {
        const view = await render(<LordIcon src="/lock.json" />);
        await ready();
        const { player } = stub;

        await view.unmount();
        await settle();
        expect(player.calls).toContain('destroy');
    });

    it('keeps the icon when a keyed list is reordered', async () => {
        const list = (keys: string[]) => (
            <div>
                {keys.map((key) => (
                    <LordIcon key={key} id={key} src={`/${key}.json`} />
                ))}
            </div>
        );
        const view = await render(list(['a', 'b']));
        await settle();
        const players = [...stub.created];
        for (const player of players) await act(async () => player.becomeReady());

        await view.rerender(list(['b', 'a']));
        await settle();

        expect(stub.created).toHaveLength(2);
        expect(players.every((player) => !player.calls.includes('destroy'))).toBe(true);
        expect([...view.container.querySelectorAll('lord-icon')].map((icon) => icon.id)).toEqual([
            'b',
            'a',
        ]);
    });
});
