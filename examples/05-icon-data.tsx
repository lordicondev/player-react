import { useEffect, useState } from 'react';
import { LordIcon, type IconData } from '../src/index.ts';
import { mount } from './mount.tsx';

function Example() {
    // The same object between renders: a new one would load the icon again.
    const [data, setData] = useState<IconData>();

    useEffect(() => {
        void fetch('/icons/trash.json')
            .then((response) => response.json())
            .then(setData);
    }, []);

    return (
        <>
            <h1>Icon data</h1>
            <p>
                <code>icon</code> takes the Lottie JSON instead of <code>src</code>: fetched,
                bundled, or made on the fly. Hover it.
            </p>
            <LordIcon icon={data} trigger="hover" />
        </>
    );
}

mount(<Example />);
