# Lordicon React

`<LordIcon>` puts an animated [Lordicon](https://lordicon.com/) icon in a React app; its props
say when it plays. It is a thin React layer over the
[`<lord-icon>`](https://www.npmjs.com/package/@lordicon/element) element, which does the work:
triggers, states, loading, reduced motion. This README covers what you need in React; the
element's README is the full reference, and its examples apply here too. For the web.

```tsx
import { LordIcon } from '@lordicon/react';

<LordIcon src="/icons/lock.json" trigger="hover" />;
```

## Install

```sh
npm install @lordicon/react
```

React 19 is required. On React 18, stay on `@lordicon/react` 1.x.

## Your first icon

Pick an icon on [lordicon.com](https://lordicon.com/), give it your style and colours there,
and download it as Lottie JSON. Put the file with your app's static files (`public/` in most
setups) and point `src` at it.

An icon holds several animations, named for what they are for: `in-*` enters, `hover-*` plays
once, `loop-*` repeats, `morph-*` goes to a second look and back. `state` picks one; without
it the icon's default plays. lordicon.com shows the states of each icon.

```tsx
<LordIcon src="/icons/coins.json" trigger="loop" state="loop-spin" />
```

## Triggers

A trigger is what plays the icon. Options go in parentheses: `loop(1000)` waits a second
between rounds.

| Trigger         | Plays                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| `hover`         | once, when the pointer enters the target or keyboard focus lands on it |
| `click`         | once per click                                                         |
| `in`            | once, when half of the icon has scrolled into view                     |
| `loop`          | over and over                                                          |
| `loop-on-hover` | over and over while the pointer is on the target                       |
| `morph`         | to the second look on pointer enter, back on leave                     |
| `boomerang`     | there and straight back on pointer enter                               |
| `follow`        | in step with an attribute of the target, `aria-pressed` by default     |
| `sequence`      | a script: `sequence(play in-reveal, wait 500, play hover-jump)`        |

The target is the icon itself, unless `target` names another element: the button around it,
say. Every option of every trigger:
[the element's README](https://www.npmjs.com/package/@lordicon/element#triggers).

## Size

An icon is 32 × 32 by default. Set `width` and `height` as on any element: with `className`,
`style` or your CSS. `1em` sizes it like the text around it, as icon sets do.

```tsx
<LordIcon src="/icons/lock.json" style={{ width: 48, height: 48 }} />
```

## Props

| Prop           | Value                                                                           |
| -------------- | ------------------------------------------------------------------------------- |
| `src`          | URL of the icon's Lottie JSON.                                                  |
| `icon`         | The Lottie JSON itself, instead of `src`. Keep the same object between renders. |
|                | `src` keeps the JSON out of your bundle; `icon` is for data you have at hand.   |
| `trigger`      | What plays it: see above.                                                       |
| `state`        | Which of the icon's animations to use. `*` plays them all.                      |
| `target`       | What the trigger follows: an ancestor's selector, an element, or a ref.         |
| `colors`       | `{ primary: '#ff5a36' }`, or `primary:#ff5a36,secondary:red`.                   |
| `stroke`       | `light`, `regular` or `bold`.                                                   |
| `speed`        | Playback speed, `1` by default.                                                 |
| `currentColor` | The icon takes `color` from the page, like text.                                |
| `intro`        | A state to play once when the icon comes into view.                             |
| `loading`      | `lazy`, `interaction` or `delay:500`.                                           |
| `motion`       | `always` animates even when the viewer asked for less motion.                   |

`intro`, `loading` and `motion` are read when the icon loads: a change applies from the next
load (a new `src`). Other props (`className`, `style`, `aria-label`, `onClick`…) go to the
element.

## State from React

`follow` keeps the icon in step with an attribute of its target, `aria-pressed` by default.
React owns the state; the button carries it:

```tsx
function Favourite() {
    const [on, setOn] = useState(false);
    return (
        <button aria-pressed={on} onClick={() => setOn(!on)}>
            <LordIcon
                src="/icons/heart.json"
                trigger="follow"
                target="button"
                state="morph-heart"
            />
        </button>
    );
}
```

Accessible components carry this state already: `aria-pressed` on toggles, `aria-expanded` on
disclosures, accordions and menus, as Radix, shadcn/ui, Headless UI and React Aria set them.
Put the icon inside, with `trigger="follow(aria-expanded)"` and `target="button"`.

## Ref and events

```tsx
import { LordIcon, type LordIconElement } from '@lordicon/react';

const icon = useRef<LordIconElement>(null);

<LordIcon
    ref={icon}
    src="/icons/coins.json"
    onReady={() => console.log(icon.current!.states)}
    onComplete={(event) => console.log(event.detail.state)}
/>;

icon.current?.play({ state: 'hover-jump' }); // queued until the icon is ready
await icon.current?.play({ state: 'in-reveal' }); // true once played to the end
```

The ref is the element: `play()`, `pause()`, `stop()`, `seek()`, `load()`, `readyPromise`,
`states` and `player`. Events: `onReady`, `onComplete`, `onError`, `onState`, `onTrigger`.

## Placeholder and server rendering

Children show until the icon is ready: a still of the icon, say, downloaded from lordicon.com
as SVG, in the same size.

```tsx
<LordIcon src="/icons/lock.json" trigger="hover">
    <img alt="" src="/icons/lock.svg" />
</LordIcon>
```

On the server `<LordIcon>` renders as `<lord-icon>` with its attributes and the placeholder,
and the icon loads once the page runs. The package is marked `'use client'`, so Server
Components can render it. Until the script runs, the element has no size of its own, nor does
the placeholder: give both one in your CSS, so the page does not shift.

```css
lord-icon {
    display: inline-block;
    width: 32px;
    height: 32px;
}

lord-icon:not(:defined) > * {
    width: 100%;
    height: 100%;
}
```

With server rendering prefer `src`: the URL is in the HTML, and the icon loads as soon as the
element is defined; `icon` reaches it only after hydration.

CSS also sees where the icon is: `lord-icon:state(ready)`, and `waiting`, `loading`, `error`,
`intro`, `playing`.

## Accessibility

Screen readers skip icons, as decoration; give one an `aria-label` when it means something on
its own. When the viewer asks for less motion, icons calm down: one-shot animations show their
last frame, morphs jump between their looks, loops and intros stay still. `motion="always"`
opts one icon out.

## Custom triggers

Register a trigger of your own once, before an icon uses it, and name it in `trigger`:

```tsx
import { BaseTrigger, defineElement, type TriggerContext } from '@lordicon/react';

class DoubleClick extends BaseTrigger {
    constructor(context: TriggerContext) {
        super(context);
        this.listen(this.target, 'dblclick', () => this.player.play({ from: 'start' }));
    }
}

defineElement({ triggers: { 'double-click': DoubleClick } });
```

## The element underneath

`<LordIcon>` renders `<lord-icon>` and hands it its props, so the element's
[README](https://www.npmjs.com/package/@lordicon/element) and
[examples](https://github.com/lordicondev/player-element/tree/main/examples) work here as they
are. To read them in React:

| In the element's docs                  | With `<LordIcon>`                          |
| -------------------------------------- | ------------------------------------------ |
| `<lord-icon trigger="hover" …>`        | `<LordIcon trigger="hover" … />`           |
| `current-color`                        | `currentColor`                             |
| `icon.target = element`                | `target={ref}`                             |
| `icon.play()`, `icon.states`           | `ref.current.play()`, `ref.current.states` |
| `icon.addEventListener('complete', …)` | `onComplete={…}`                           |
| `defineElement()`, `BaseTrigger`, …    | the same, imported from `@lordicon/react`  |

CSS works the same way on `lord-icon`: `:state()`, and colours as `--lord-icon-primary` and so
on. The examples of this repository (`npm start`) show the React side.

## Upgrading

What changed from 1.x, and what to write instead: [CHANGELOG.md](CHANGELOG.md).

## Development

```sh
npm install
npm start          # the examples at localhost:8080
npm test
npm run check      # types, lint, formatting
npm run build      # dist/: the package and its type declarations
```

## License

MIT
