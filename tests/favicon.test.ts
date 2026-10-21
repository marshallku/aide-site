import { describe, expect, it } from "vitest";

import { faviconSvg } from "../scripts/lib/favicon.mjs";

describe("faviconSvg", () => {
    it("puts the mark's path on the icon's tile", () => {
        const svg = faviconSvg('<svg viewBox="0 0 1254 1254"><path fill="currentColor" d="M1 2L3 4Z"/></svg>');
        expect(svg).toContain('d="M1 2L3 4Z"');
        expect(svg).toContain('stop-color="#2b2d52"');
        expect(svg).toContain('fill="url(#tile)"');
    });

    it("refuses a mark without a path", () => {
        expect(() => faviconSvg("<svg></svg>")).toThrow();
    });
});
