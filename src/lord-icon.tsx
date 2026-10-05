import {
    defineElement,
    type CompleteDetail,
    type IconData,
    type LordIconElement,
    type MotionMode,
    type Stroke,
    type Trigger,
} from '@lordicon/element';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    type HTMLAttributes,
    type ReactNode,
    type Ref,
    type RefObject,
} from 'react';

export type LordIconProps = Omit<HTMLAttributes<LordIconElement>, 'onError' | 'children'> & {
    /** URL of the icon's Lottie JSON. */
    src?: string;
    /** The icon's Lottie JSON, instead of `src`. Keep the same object between renders. */
    icon?: IconData;
    /**
     * What plays it: a trigger's name, with options as in the attribute (`hover`,
     * `loop(1000)`). The built-in ones: https://www.npmjs.com/package/@lordicon/element#triggers
     */
    trigger?: string;
    /** What the trigger follows: a selector of an ancestor, an element, or a ref to one. */
    target?: string | HTMLElement | RefObject<HTMLElement | null> | null;
    /** Which of the icon's animations to use. `*` plays them all. */
    state?: string;
    /** `primary:#ff5a36,secondary:red`, or `{ primary: '#ff5a36' }`. */
    colors?: string | Record<string, string>;
    stroke?: Stroke;
    /** Playback speed, `1` by default. */
    speed?: number;
    /** The icon takes `color` from the page, like text. */
    currentColor?: boolean;
    /**
     * A state to play once when the icon comes into view, before the trigger starts. Read
     * when the icon loads, as are `loading` and `motion`: a change applies from the next load.
     */
    intro?: string;
    /** `lazy`, `interaction` or `delay:500`. Read when the icon loads. */
    loading?: string;
    /** `always` animates this icon even when the viewer asked for less motion. Read when the icon loads. */
    motion?: MotionMode;

    /** The icon can be played. */
    onReady?: (event: CustomEvent<void>) => void;
    /** An animation played to its end. */
    onComplete?: (event: CustomEvent<CompleteDetail>) => void;
    /** The icon could not load. */
    onError?: (event: CustomEvent<Error>) => void;
    /** The `state` changed. */
    onState?: (event: CustomEvent<string | null>) => void;
    /** A trigger started, was replaced, or went with the icon (null). */
    onTrigger?: (event: CustomEvent<Trigger | null>) => void;

    /** The `<lord-icon>` element: `play()`, `pause()`, `readyPromise`, `player`… */
    ref?: Ref<LordIconElement>;
    /** Shows until the icon is ready, as a placeholder. */
    children?: ReactNode;
};

/** `<lord-icon>` for JSX, typed here rather than in the page's global JSX namespace. */
const Element = 'lord-icon' as unknown as (props: Record<string, unknown>) => ReactNode;

/** The element's own events, by the prop that listens for each. */
const EVENTS = {
    onReady: 'ready',
    onComplete: 'complete',
    onError: 'error',
    onState: 'state',
    onTrigger: 'trigger',
} as const;

/**
 * An animated Lordicon icon: `<lord-icon>`, with its attributes as props.
 *
 *     <LordIcon src="/icons/lock.json" trigger="hover" />
 */
export function LordIcon(props: LordIconProps) {
    const {
        icon,
        target,
        colors,
        currentColor,
        onReady,
        onComplete,
        onError,
        onState,
        onTrigger,
        ref,
        ...rest
    } = props;

    // Defined on first use, so a page that defines it first (a subclass, say) keeps its own.
    defineElement();

    const element = useRef<LordIconElement>(null);
    const setRef = useCallback(
        (node: LordIconElement | null) => {
            element.current = node;
            let cleanup: void | (() => void);
            if (typeof ref === 'function') cleanup = ref(node);
            else if (ref) ref.current = node;

            return () => {
                element.current = null;
                if (cleanup) cleanup();
                else if (typeof ref === 'function') ref(null);
                else if (ref) ref.current = null;
            };
        },
        [ref],
    );

    // An element target, or a ref to one, is set once the whole commit is done: a ref to an
    // element after the icon fills in only then. Runs after every render, since a ref can
    // change without one; a trigger that started meanwhile moves over to the target.
    useEffect(() => {
        const node = element.current;
        if (!node || target == null || typeof target === 'string') return;
        const resolved = target instanceof HTMLElement ? target : target.current;
        if (resolved && node.target !== resolved) node.target = resolved;
    });

    // Listeners go on before the icon can get anywhere: it loads after this commit.
    useLayoutEffect(() => {
        const node = element.current;
        if (!node) return;

        const handlers = { onReady, onComplete, onError, onState, onTrigger };
        const controller = new AbortController();
        for (const [prop, type] of Object.entries(EVENTS)) {
            const handler = handlers[prop as keyof typeof EVENTS] as
                ((event: Event) => void) | undefined;
            if (handler) node.addEventListener(type, handler, { signal: controller.signal });
        }
        return () => controller.abort();
    }, [onReady, onComplete, onError, onState, onTrigger]);

    // React does not set a custom element's properties when it hydrates one: the icon data
    // would never reach an icon rendered on the server. Setting the same data again does
    // nothing, so this costs nothing where React has set it.
    useLayoutEffect(() => {
        if (element.current) element.current.icon = icon;
    }, [icon]);

    // Objects become properties in the browser; the server renders only text.
    return (
        <Element
            {...rest}
            ref={setRef}
            icon={icon}
            target={typeof target === 'string' ? target : undefined}
            colors={typeof colors === 'object' ? formatColors(colors) : colors}
            current-color={currentColor ? '' : undefined}
        />
    );
}

/** `{ primary: 'red' }` as the attribute has it: `primary:red`. */
function formatColors(colors: Record<string, string>): string {
    return Object.entries(colors)
        .map(([name, value]) => `${name}:${value}`)
        .join(',');
}
