import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

/**
 * The npm package: ESM with React and `@lordicon/element` left external, plus type
 * declarations.
 */
export default defineConfig({
    plugins: [
        dts({
            include: ['src'],
            exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/testing/**'],
            // Declarations mirror src/ but sit at the dist root, next to index.js.
            beforeWriteFile: (filePath, content) => ({
                filePath: filePath.replace('/dist/src/', '/dist/'),
                content,
            }),
        }),
    ],
    build: {
        target: 'es2022',
        lib: {
            formats: ['es'],
            // The component in a file of its own, so that only it is client code.
            entry: {
                index: resolve(import.meta.dirname, 'src', 'index.ts'),
                'lord-icon': resolve(import.meta.dirname, 'src', 'lord-icon.tsx'),
            },
            fileName: (_format, name) => `${name}.js`,
        },
        rollupOptions: {
            external: [/^react($|\/)/, /^@lordicon\/element($|\/)/],
            // The component uses hooks: frameworks with server components (Next.js) need this
            // on its file, since bundling drops it from the source. Only there: the rest is
            // the element's API, and Next.js refuses `export *` in client code.
            output: {
                banner: (chunk) => (chunk.name === 'lord-icon' ? "'use client';" : ''),
            },
        },
    },
});
