# Changelog

## 2.0.0

A new package on the same name: `<LordIcon>` renders the `<lord-icon>` element
(`@lordicon/element` 3), for the web and React 19. Triggers, loading strategies, intros and
reduced motion come with it.

React 19 only: it sets the element's properties and passes `ref` as a prop, which React 18
does not. On React 18, stay on 1.x.

React Native is no longer here: this package has no `lottie-web`, `lottie-react-native` or
`react-native` peers. The web and native players work too differently to share one component.

### Migrating from 1.x

| 1.x                                     | 2.0                                                     |
| --------------------------------------- | ------------------------------------------------------- |
| `<Player icon={ICON} />`                | `<LordIcon icon={ICON} />`, or `src="/icons/x.json"`    |
| `size={64}`                             | CSS: `width` and `height` on `lord-icon`                |
| `colors="primary:red"`                  | `colors={{ primary: 'red' }}`, or the same string       |
| `colorize="red"`                        | `currentColor` with CSS `color: red`                    |
| `direction={-1}`                        | `ref.current.play({ reverse: true })`                   |
| `renderMode`                            | gone                                                    |
| `onReady`, `onComplete`                 | the same, with the event as argument                    |
| `ref.current.playFromBeginning()`       | `ref.current.play({ from: 'start' })`                   |
| `ref.current.goToFirstFrame()` / `Last` | `ref.current.seek('start')` / `seek('end')`             |
| `ref.current.isPlaying`, `frames`       | `ref.current.player.playing`, `player.frameCount`       |
| `ref.current.states`, `currentState`    | `ref.current.states`, `ref.current.player.currentState` |
| playing on hover, in a `useEffect`      | `trigger="hover"`, and the other triggers               |
