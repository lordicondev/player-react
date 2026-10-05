import type { ReactNode } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { vi } from 'vitest';
import { iconData } from './player.ts';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Renders into a container on the page; `rerender` and `unmount` go through `act`. */
export async function render(node: ReactNode) {
    const container = document.createElement('div');
    document.body.append(container);
    const root: Root = createRoot(container);
    await act(async () => root.render(node));

    return {
        container,
        /** The `<lord-icon>` rendered, as the element. */
        get icon() {
            return container.querySelector('lord-icon')!;
        },
        rerender: (next: ReactNode) => act(async () => root.render(next)),
        unmount: () => act(async () => root.unmount()),
    };
}

/** A fetch that serves `data` for every URL, or fails with `status`. */
export function stubFetch(data: unknown = iconData(), status = 200) {
    const fetch = vi.fn(async () => ({
        ok: status === 200,
        status,
        statusText: status === 200 ? 'OK' : 'Not Found',
        json: async () => data,
    }));
    vi.stubGlobal('fetch', fetch);
    return fetch;
}

/** Lets pending promises and timers settle, inside `act`. */
export function settle(): Promise<void> {
    return act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
}
