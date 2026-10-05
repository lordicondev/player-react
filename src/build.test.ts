// @vitest-environment node
import { build, type Rolldown } from 'vite';
import { describe, expect, it } from 'vitest';
import config from '../vite.config.ts';

/** The package as `npm run build` makes it, in memory and without the type declarations. */
async function bundle(): Promise<Rolldown.OutputChunk[]> {
    const [output] = (await build({
        ...config,
        configFile: false,
        logLevel: 'silent',
        plugins: [],
        build: { ...config.build, write: false },
    })) as Rolldown.RolldownOutput[];
    return output.output.filter((file) => file.type === 'chunk');
}

describe('the package', () => {
    it('marks only the component as client code, without `export *` there', async () => {
        const chunks = await bundle();
        const client = chunks.filter((chunk) => chunk.code.startsWith('"use client";'));

        expect(chunks.map((chunk) => chunk.fileName).sort()).toEqual(['index.js', 'lord-icon.js']);
        expect(client.map((chunk) => chunk.fileName)).toEqual(['lord-icon.js']);
        expect(client[0].code).not.toMatch(/export \*/);
    });
});
