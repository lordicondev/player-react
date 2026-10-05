// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LordIcon } from './index.ts';
import { iconData } from './testing/player.ts';

describe('on a server', () => {
    it('renders <lord-icon> with its attributes and the placeholder, and skips objects', () => {
        const html = renderToString(
            <LordIcon
                src="/lock.json"
                trigger="hover"
                colors={{ primary: 'red' }}
                speed={2}
                currentColor
                icon={iconData()}
                target={{ current: null }}
                onReady={() => {}}
            >
                <img alt="" src="/lock.svg" />
            </LordIcon>,
        );

        // React adds a preload link for the image ahead of it.
        expect(html).toContain(
            '<lord-icon src="/lock.json" trigger="hover" speed="2" colors="primary:red"' +
                ' current-color=""><img alt="" src="/lock.svg"/></lord-icon>',
        );
    });
});
