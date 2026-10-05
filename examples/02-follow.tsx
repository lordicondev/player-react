import { useState } from 'react';
import { LordIcon } from '../src/index.ts';
import { mount } from './mount.tsx';

/** A toggle: React owns `pressed`, the icon follows the button's aria-pressed. */
function Toggle({ state, src, label }: { state: string; src: string; label: string }) {
    const [pressed, setPressed] = useState(false);
    return (
        <button
            type="button"
            className="toggle"
            aria-pressed={pressed}
            aria-label={label}
            onClick={() => setPressed(!pressed)}
        >
            <LordIcon trigger="follow" target="button" state={state} src={src} />
        </button>
    );
}

function Example() {
    return (
        <>
            <h1>Follow React state</h1>
            <p>
                State lives in React and reaches the button as <code>aria-pressed</code>;{' '}
                <code>trigger="follow"</code> keeps the icon in step. Click the buttons.
            </p>
            <div className="controls">
                <Toggle state="morph-select" src="/icons/morph-select.json" label="Select" />
                <Toggle state="morph-trash-full" src="/icons/trash.json" label="Fill the bin" />
            </div>
        </>
    );
}

mount(<Example />);
