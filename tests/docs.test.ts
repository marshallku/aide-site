import { existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import plugins from "../src/data/plugins.json";

const DOCS = join(import.meta.dirname, "../src/content/docs");
const EN = join(DOCS, "docs");
const KO = join(DOCS, "ko/docs");

function pages(root: string): string[] {
    if (!existsSync(root)) return [];
    return readdirSync(root, { recursive: true, encoding: "utf8" })
        .filter((path) => /\.mdx?$/.test(path))
        .map((path) => relative(root, join(root, path)).replace(/\.mdx?$/, ""))
        .sort();
}

const page = (root: string, slug: string) => ["md", "mdx"].some((ext) => existsSync(join(root, `${slug}.${ext}`)));

describe("the manual", () => {
    it("has every English page in Korean too, and nothing only in Korean", () => {
        expect(pages(KO)).toEqual(pages(EN));
    });

    it.each([...plugins.server.map((plugin) => plugin.id), ...plugins.device.map((plugin) => plugin.id)])(
        "has a page for the %s plugin",
        (id) => {
            expect(page(EN, `plugins/${id}`)).toBe(true);
        },
    );
});

describe("the landing page", () => {
    it("has a line for every plugin in both languages", async () => {
        const { PLUGIN_BLURBS } = await import("../src/lib/landing-copy");
        const ids = [...plugins.server, ...plugins.device].map((plugin) => plugin.id);
        for (const lang of ["en", "ko"] as const) {
            expect(ids.filter((id) => !PLUGIN_BLURBS[lang][id])).toEqual([]);
        }
    });
});
