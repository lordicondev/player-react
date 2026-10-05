import { LordIcon } from '../src/index.ts';
import { mount } from './mount.tsx';

function Example() {
    return (
        <>
            <h1>A placeholder</h1>
            <p>
                Children show until the icon is ready: here a still of the icon, for the second and
                a half this one waits. With server rendering the placeholder is in the page before
                any script runs; give <code>lord-icon</code> a size in CSS there.
            </p>
            <div className="rows">
                <div className="row">
                    <LordIcon src="/icons/lock.json" trigger="hover" loading="delay:1500">
                        <img alt="" src="/icons/lock.svg" />
                    </LordIcon>
                    <pre>
                        {`<LordIcon src="/icons/lock.json" trigger="hover">
  <img alt="" src="/icons/lock.svg" />
</LordIcon>`}
                    </pre>
                </div>
            </div>
        </>
    );
}

mount(<Example />);
