import { useState } from 'react';
import { LordIcon } from '../src/index.ts';
import { mount } from './mount.tsx';

function Example() {
    const [cards, setCards] = useState<number[]>([]);

    return (
        <>
            <h1>Intro on mount</h1>
            <p>
                Each card comes from React state and slides in. <code>intro</code> plays its icon
                once, after the card has stopped (<code>after=.card</code>); then hover takes over.
            </p>
            <p>
                <code>intro</code>, like <code>loading</code> and <code>motion</code>, is read when
                the icon loads: a new card gets it, while a change to the prop of an icon already
                there waits for its next load.
            </p>
            <div className="controls">
                <button onClick={() => setCards((current) => [...current, current.length + 1])}>
                    Add a card
                </button>
            </div>
            <pre>
                {`<div className="card">
  <LordIcon
    src="/icons/coins.json"
    intro="in-reveal, after=.card"
    trigger="hover"
    target=".card"
  />
  …
</div>`}
            </pre>
            {cards.map((card) => (
                <div className="card" key={card}>
                    <LordIcon
                        src="/icons/coins.json"
                        intro="in-reveal, after=.card"
                        trigger="hover"
                        target=".card"
                    />
                    <span>Card {card}</span>
                </div>
            ))}
        </>
    );
}

mount(<Example />);
