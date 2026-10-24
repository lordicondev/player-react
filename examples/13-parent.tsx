import { LordIcon } from '../src/index.ts';
import { mount } from './mount.tsx';

function Example() {
    return (
        <>
            <h1>Parent as target</h1>
            <p>
                You can set parent of icon as trigger without adding any class or ref to parent
                simply by <code>/parent</code> command
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div
                    style={{
                        border: '1px dashed #000',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 'fit-content',
                        height: 'fit-content',
                    }}
                >
                    <h2 style={{ margin: 0 }}>Hover this div</h2>
                    <LordIcon src="/icons/lock.json" target="/parent" trigger="hover" />
                </div>
                <pre>
                    {`<div>
        <h2>Hover this div</h2>
        <LordIcon src="/icons/lock.json" target="/parent" trigger="hover" />
</div>`}
                </pre>
            </div>
            <p>
                You can go for level of parents by using <code>/parent*n</code> command
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div
                    style={{
                        border: '1px dashed #000',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 0,
                        width: 'fit-content',
                    }}
                >
                    <h2 style={{ margin: 0 }}>Hover this div</h2>
                    <div
                        style={{
                            border: '1px dashed #000',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 0,
                            width: 'fit-content',
                        }}
                    >
                        <LordIcon src="/icons/lock.json" target="/parent*2" trigger="hover" />
                    </div>
                </div>
                <pre>
                    {`<div>
    <h2>Hover this div</h2>
    <div>
        <LordIcon src="/icons/lock.json" target="/parent*2" trigger="hover" />
    </div>
</div>`}
                </pre>
            </div>
        </>
    );
}

mount(<Example />);
