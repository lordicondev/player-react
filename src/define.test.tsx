import { BaseTrigger, defineElement, Hover, LordIconElement } from '@lordicon/element';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LordIcon } from './lord-icon.tsx';
import { useStubPlayer } from './testing/player.ts';
import { render, settle, stubFetch } from './testing/render.tsx';

describe('the element behind LordIcon', () => {
    it('is the page’s own when the page defined it first', async () => {
        class SecretIcon extends LordIconElement {}
        defineElement({ element: SecretIcon });

        const { icon } = await render(<LordIcon />);
        expect(customElements.get('lord-icon')).toBe(SecretIcon);
        expect(icon).toBeInstanceOf(SecretIcon);
    });

    it('plays with a built-in trigger the page replaced', async () => {
        class MyHover extends BaseTrigger {}
        defineElement({ triggers: { hover: MyHover } });
        const stub = useStubPlayer();
        stubFetch();

        const { icon } = await render(<LordIcon src="/lock.json" trigger="hover" />);
        await settle();
        await act(async () => stub.player.becomeReady());
        await settle();

        expect((icon as LordIconElement).currentTrigger).toBeInstanceOf(MyHover);

        stub.restore();
        vi.unstubAllGlobals();
        defineElement({ triggers: { hover: Hover } });
    });
});
