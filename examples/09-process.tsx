import { useState } from 'react';
import { LordIcon } from '../src/index.ts';
import { mount } from './mount.tsx';

type Stage = 'idle' | 'busy' | 'done';

function Example() {
    const [stage, setStage] = useState<Stage>('idle');
    const [state, setState] = useState('hover-jump');

    const run = () => {
        setStage('busy');
        setTimeout(() => setStage('done'), 2500);
    };

    return (
        <>
            <h1>A process</h1>
            <p>
                React owns the stage; the element carries it as <code>data-stage</code>, and{' '}
                <code>follow</code> gives each value a state: a loop while busy, a nudge when done.
            </p>
            <div className="controls" data-stage={stage}>
                <LordIcon
                    src="/icons/coins.json"
                    trigger="follow(data-stage, busy=loop-spin, done=hover-jump)"
                    target="[data-stage]"
                />
                <button onClick={run} disabled={stage === 'busy'}>
                    {stage === 'busy' ? 'Working…' : 'Run'}
                </button>
                <span>{stage}</span>
            </div>

            <h2>The state from a select</h2>
            <p>
                <code>state</code> is a prop like any other: pick one, then hover the icon.
            </p>
            <div className="controls">
                <LordIcon src="/icons/coins.json" trigger="hover" state={state} />
                <select value={state} onChange={(event) => setState(event.target.value)}>
                    <option>in-reveal</option>
                    <option>hover-jump</option>
                    <option>hover-spending</option>
                </select>
            </div>
        </>
    );
}

mount(<Example />);
