import { describe, expect, it } from "vitest";

import { tokensCss } from "../scripts/lib/tokens.mjs";

const TOKENS = {
    color: {
        tokens: [
            { name: "card", value: { light: "#ffffff", dark: "#1e1e1e" } },
            { name: "accent", value: { light: "#0a7aff", dark: "#0a84ff" } },
        ],
    },
    spacing: { tokens: [{ name: "space-m", value: "8px" }] },
    radius: { tokens: [{ name: "radius-m", value: "10px" }] },
    type: { families: { mono: "ui-monospace, monospace" } },
};

describe("tokensCss", () => {
    const css = tokensCss(TOKENS);

    it("puts scalars, families and light colours on :root", () => {
        const root = css.split(":root[data-theme")[0];
        expect(root).toContain("--space-m: 8px;");
        expect(root).toContain("--radius-m: 10px;");
        expect(root).toContain("--font-mono: ui-monospace, monospace;");
        expect(root).toContain("--card: #ffffff;");
    });

    it("gives dark colours to the explicit dark theme and to the system preference", () => {
        expect(css).toMatch(/:root\[data-theme="dark"\] \{\n {4}--card: #1e1e1e;/);
        expect(css).toMatch(/:root:not\(\[data-theme="light"\]\) \{\n {8}--card: #1e1e1e;/);
    });
});
