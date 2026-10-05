import { useRef, useState } from 'react';
import { LordIcon, type LordIconElement } from '../src/index.ts';
import { mount } from './mount.tsx';

function Example() {
    const icon = useRef<LordIconElement>(null);
    const [log, setLog] = useState<string[]>([]);
    const note = (line: string) => setLog((lines) => [...lines.slice(-4), line]);

    return (
        <>
            <h1>Methods and events</h1>
            <p>
                A ref gives the element, with <code>play()</code>, <code>pause()</code>,{' '}
                <code>stop()</code>, <code>seek()</code> and <code>states</code>.
            </p>
            <div className="controls">
                <LordIcon
                    ref={icon}
                    src="/icons/coins.json"
                    onReady={() => note(`ready: ${icon.current?.states.map((s) => s.name)}`)}
                    onComplete={(event) => note(`complete: ${event.detail.state}`)}
                />
                <button onClick={() => icon.current?.play({ state: 'hover-jump' })}>
                    play hover-jump
                </button>
                <button
                    onClick={async () => {
                        const finished = await icon.current?.play({ state: 'in-reveal' });
                        note(`in-reveal played to the end: ${finished}`);
                    }}
                >
                    await play in-reveal
                </button>
                <button onClick={() => icon.current?.pause()}>pause</button>
                <button onClick={() => icon.current?.stop()}>stop</button>
            </div>
            <pre className="log">{log.join('\n')}</pre>
        </>
    );
}

mount(<Example />);
