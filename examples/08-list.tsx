import { useState } from 'react';
import { LordIcon } from '../src/index.ts';
import { mount } from './mount.tsx';

const ICONS = ['lock', 'coins', 'trash', 'morph-select'];

/** Many rows: each icon loads once it scrolls into view, and keeps playing when rows move. */
function Example() {
    const [rows, setRows] = useState(() =>
        Array.from({ length: 40 }, (_, index) => ({
            id: index,
            icon: ICONS[index % ICONS.length],
        })),
    );

    return (
        <>
            <h1>A list</h1>
            <p>
                <code>loading="lazy"</code> loads each icon when its row comes into view. With a{' '}
                <code>key</code> per row, reordering moves the icons, which go on without loading
                again.
            </p>
            <div className="controls">
                <button onClick={() => setRows((current) => [...current].reverse())}>
                    Reverse the list
                </button>
            </div>
            <div className="rows">
                {rows.map((row) => (
                    <div className="row" key={row.id}>
                        <LordIcon src={`/icons/${row.icon}.json`} trigger="hover" loading="lazy" />
                        <span>
                            Row {row.id + 1}: {row.icon}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}

mount(<Example />);
