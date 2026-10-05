import { LordIcon } from '../src/index.ts';
import { mount } from './mount.tsx';

function Example() {
    return (
        <>
            <h1>States</h1>
            <p>
                CSS sees where the icon is, with no React state needed:{' '}
                <code>.fade:state(ready) {'{ opacity: 1 }'}</code>.
            </p>
            <LordIcon
                className="fade"
                src="/icons/coins.json"
                trigger="hover"
                loading="delay:1500"
            />

            <h2>Playing</h2>
            <p>
                <code>button:has(lord-icon:state(playing))</code> marks the button while its icon
                plays. Click it.
            </p>
            <button type="button" className="play-button">
                <LordIcon src="/icons/lock.json" trigger="click" target="button" />
            </button>
        </>
    );
}

mount(<Example />);
