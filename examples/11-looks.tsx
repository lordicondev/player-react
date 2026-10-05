import { useState, type CSSProperties } from 'react';
import { LordIcon, type Stroke } from '../src/index.ts';
import { mount } from './mount.tsx';

function Example() {
    // The icon's own colours to start with.
    const [primary, setPrimary] = useState('#08a88a');
    const [secondary, setSecondary] = useState('#121331');
    const [stroke, setStroke] = useState<Stroke>('regular');
    const [speed, setSpeed] = useState(1);
    const [currentColor, setCurrentColor] = useState(false);
    const [text, setText] = useState('#e83a30');
    const [variable, setVariable] = useState('#3a7db7');

    const code = currentColor
        ? `<div style={{ color: '${text}' }}>
  <LordIcon stroke="${stroke}" speed={${speed}} currentColor … />
</div>`
        : `<LordIcon
  colors={{ primary: '${primary}', secondary: '${secondary}' }}
  stroke="${stroke}"
  speed={${speed}}
  …
/>`;

    return (
        <>
            <h1>Looks from React state</h1>
            <p>
                <code>colors</code>, <code>stroke</code>, <code>speed</code> and{' '}
                <code>currentColor</code> are props like any other: a change applies to the icon as
                it plays, without loading it again.
            </p>
            <div className="controls">
                <label>
                    primary{' '}
                    <input
                        type="color"
                        value={primary}
                        disabled={currentColor}
                        onChange={(event) => setPrimary(event.target.value)}
                    />
                </label>
                <label>
                    secondary{' '}
                    <input
                        type="color"
                        value={secondary}
                        disabled={currentColor}
                        onChange={(event) => setSecondary(event.target.value)}
                    />
                </label>
                <label>
                    stroke{' '}
                    <select
                        value={stroke}
                        onChange={(event) => setStroke(event.target.value as Stroke)}
                    >
                        <option>light</option>
                        <option>regular</option>
                        <option>bold</option>
                    </select>
                </label>
                <label>
                    speed{' '}
                    <input
                        type="range"
                        min={0.25}
                        max={3}
                        step={0.25}
                        value={speed}
                        onChange={(event) => setSpeed(Number(event.target.value))}
                    />{' '}
                    {speed}
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={currentColor}
                        onChange={(event) => setCurrentColor(event.target.checked)}
                    />{' '}
                    currentColor
                </label>
                {currentColor && (
                    <label>
                        text{' '}
                        <input
                            type="color"
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                        />
                    </label>
                )}
            </div>
            <div className="rows">
                <div className="row">
                    <div style={{ color: text, lineHeight: 0 }}>
                        <LordIcon
                            src="/icons/lock.json"
                            trigger="loop"
                            colors={{ primary, secondary }}
                            stroke={stroke}
                            speed={speed}
                            currentColor={currentColor}
                        />
                    </div>
                    <pre>{code}</pre>
                </div>
            </div>

            <h2>A colour from CSS</h2>
            <p>
                A colour can also come from CSS, as <code>--lord-icon-primary</code> and so on: from
                a stylesheet, or from <code>style</code>. TypeScript does not know the variable,
                hence the cast.
            </p>
            <div className="controls">
                <label>
                    --lord-icon-primary{' '}
                    <input
                        type="color"
                        value={variable}
                        onChange={(event) => setVariable(event.target.value)}
                    />
                </label>
            </div>
            <div className="rows">
                <div className="row">
                    <LordIcon
                        src="/icons/lock.json"
                        trigger="hover"
                        style={{ '--lord-icon-primary': variable } as CSSProperties}
                    />
                    <pre>{`<LordIcon
  style={{ '--lord-icon-primary': '${variable}' } as CSSProperties}
  …
/>`}</pre>
                </div>
            </div>
        </>
    );
}

mount(<Example />);
