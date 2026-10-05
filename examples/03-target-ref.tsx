import { useRef } from 'react';
import { LordIcon } from '../src/index.ts';
import { mount } from './mount.tsx';

function Example() {
    const button = useRef<HTMLButtonElement>(null);
    return (
        <>
            <h1>A target from a ref</h1>
            <p>
                <code>target</code> takes a ref: the icon follows an element that is not around it.
                Hover or focus the button.
            </p>
            <div className="controls">
                <LordIcon src="/icons/lock.json" trigger="hover" target={button} />
                <button ref={button}>Unlock</button>
            </div>
        </>
    );
}

mount(<Example />);
