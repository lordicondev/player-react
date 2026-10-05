import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

/** Renders an example into the page's #root. */
export function mount(node: ReactNode): void {
    createRoot(document.querySelector('#root')!).render(<StrictMode>{node}</StrictMode>);
}
