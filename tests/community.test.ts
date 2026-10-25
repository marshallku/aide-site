import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import data from "../src/data/community-plugins.json";
import { describeCapability, reportHref, type CommunityPlugin } from "../src/lib/capabilities";

const COMMUNITY_PLUGINS: CommunityPlugin[] = data.plugins;

const ROOT = join(import.meta.dirname, "..");

describe("the iPhone app's universal links", () => {
    const aasa = JSON.parse(readFileSync(join(ROOT, "public/.well-known/apple-app-site-association"), "utf8"));

    it("name the app and every plugin page in both languages, not the list", () => {
        const [detail] = aasa.applinks.details;
        expect(detail.appIDs).toEqual(["8QNJMX7JJ2.com.marshallku.aide"]);
        expect(detail.components.map((component: { "/": string }) => component["/"])).toEqual([
            "/plugins/?*",
            "/ko/plugins/?*",
        ]);
    });

    it("are served as JSON", () => {
        expect(readFileSync(join(ROOT, "nginx.conf"), "utf8")).toMatch(
            /location = \/\.well-known\/apple-app-site-association \{\s*default_type application\/json;/,
        );
    });
});

describe("the community plugins", () => {
    it("say what each plugin asks for in words, in both languages", () => {
        for (const plugin of COMMUNITY_PLUGINS) {
            for (const capability of plugin.capabilities) {
                for (const locale of ["en", "ko"] as const) {
                    expect(describeCapability(capability, locale), `${plugin.id} ${capability}`).not.toBe(capability);
                }
            }
        }
    });

    it("report problems on the index's GitHub repository", () => {
        for (const plugin of COMMUNITY_PLUGINS) {
            expect(reportHref(plugin), plugin.id).toMatch(
                /^https:\/\/github\.com\/.+\/issues\/new\?template=report-plugin\.md&title=Report%3A%20/,
            );
        }
    });
});
