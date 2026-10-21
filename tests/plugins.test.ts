import { describe, expect, it } from "vitest";

import { changedPlugins } from "../scripts/lib/plugins.mjs";

const snapshot = (briefingAt: string) => ({
    server: [
        { id: "briefing", manifest: { settings: [{ key: "at", title: briefingAt }] } },
        { id: "loops", manifest: {} },
    ],
    device: [{ id: "pomodoro" }],
});

describe("changedPlugins", () => {
    it("is empty for the same snapshot", () => {
        expect(changedPlugins(snapshot("Time"), snapshot("Time"))).toEqual([]);
    });

    it("names a plugin whose manifest changed", () => {
        expect(changedPlugins(snapshot("Time"), snapshot("When"))).toEqual(["briefing"]);
    });

    it("tells a server plugin from a device plugin with the same id", () => {
        const before = { server: [{ id: "recall", manifest: { version: "1" } }], device: [{ id: "recall" }] };
        const after = { server: [{ id: "recall", manifest: { version: "2" } }], device: [{ id: "recall" }] };
        expect(changedPlugins(before, after)).toEqual(["recall"]);
    });

    it("names plugins added and removed", () => {
        const after = { server: [{ id: "loops", manifest: {} }], device: [{ id: "pomodoro" }, { id: "atlas" }] };
        expect(changedPlugins(snapshot("Time"), after)).toEqual(["atlas (device)", "briefing"]);
    });
});
