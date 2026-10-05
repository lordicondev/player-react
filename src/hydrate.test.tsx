import type { LordIconElement } from '@lordicon/element';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LordIcon } from './lord-icon.tsx';
import { iconData, useStubPlayer } from './testing/player.ts';
import { settle, stubFetch } from './testing/render.tsx';

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

describe('hydration', () => {
    it('takes over the server’s markup without a mismatch, and loads the icon', async () => {
        const page = (
            <LordIcon
                src="/lock.json"
                trigger="hover"
                state="hover-jump"
                colors={{ primary: 'red' }}
                speed={2}
                currentColor
            >
                <img alt="" src="/lock.svg" />
            </LordIcon>
        );
        const container = document.createElement('div');
        container.innerHTML = renderToString(page);
        document.body.append(container);

        const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
        const recoverable = vi.fn();
        await act(async () => {
            hydrateRoot(container, page, { onRecoverableError: recoverable });
        });
        await settle();

        expect(errors).not.toHaveBeenCalled();
        expect(recoverable).not.toHaveBeenCalled();
        expect(stub.created).toHaveLength(1);
        expect(container.querySelector('lord-icon')!.getAttribute('speed')).toBe('2');
        errors.mockRestore();
    });

    it('gives the icon data to the element, which the server could not render', async () => {
        const data = iconData();
        const page = <LordIcon icon={data} trigger="hover" />;
        const container = document.createElement('div');
        container.innerHTML = renderToString(page);
        document.body.append(container);

        await act(async () => {
            hydrateRoot(container, page);
        });
        await settle();

        expect(container.querySelector<LordIconElement>('lord-icon')!.icon).toBe(data);
        expect(stub.created).toHaveLength(1);
        expect(stub.player.data).toBe(data);
        expect(fetch).not.toHaveBeenCalled();
    });
});
