import { LordIcon } from '../src/index.ts';
import { mount } from './mount.tsx';

function Example() {
    return (
        <>
            <h1>Getting started</h1>
            <p>
                <code>src</code> and <code>trigger</code> are all it takes. Children show until the
                icon is ready.
            </p>
            <div className="rows">
                <div className="row">
                    <LordIcon src="/icons/lock.json" trigger="hover" />
                    <pre>{'<LordIcon src="/icons/lock.json" trigger="hover" />'}</pre>
                </div>
                <div className="row">
                    <LordIcon src="/icons/coins.json" trigger="loop(1000)" state="hover-jump" />
                    <pre>
                        {
                            '<LordIcon src="/icons/coins.json" trigger="loop(1000)" state="hover-jump" />'
                        }
                    </pre>
                </div>
                <div className="row">
                    <LordIcon
                        src="/icons/lock.json"
                        trigger="click"
                        loading="delay:1500"
                        colors={{ primary: '#08c18a' }}
                    >
                        <img alt="" src="/icons/lock.svg" />
                    </LordIcon>
                    <pre>
                        {`<LordIcon src="/icons/lock.json" trigger="click"
  loading="delay:1500" colors={{ primary: '#08c18a' }}>
  <img alt="" src="/icons/lock.svg" />
</LordIcon>`}
                    </pre>
                </div>
            </div>
        </>
    );
}

mount(<Example />);
