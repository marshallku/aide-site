// Copies what the site shares with AIDE from a checkout of the (private) AIDE repo, so the build
// itself never needs it: the design tokens as CSS, the app mark, the icon set and the assistant's
// characters. Run it when AIDE's design changes: `AIDE_REPO=~/dev/aide node scripts/sync-from-aide.mjs`.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

import { faviconSvg } from "./lib/favicon.mjs";
import { tokensCss } from "./lib/tokens.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const AIDE = resolve(process.env.AIDE_REPO ?? join(homedir(), "dev/aide"));
const ASSETS = join(ROOT, "src/assets/aide");

const read = (path) => readFileSync(join(AIDE, path), "utf8");
const git = (...args) => execFileSync("git", ["-C", AIDE, ...args], { encoding: "utf8" }).trim();

// The icons the site draws, from AIDE's set (Phosphor, MIT); the names are design/icons.json's.
const ICONS = [
    "assistant",
    "calendar",
    "devices",
    "feed",
    "graph",
    "inbox",
    "key",
    "mic",
    "organize",
    "people",
    "plugin",
    "review",
    "scratch",
    "search",
    "server",
    "settings",
    "terminal",
    "timer",
    "todos",
    "wiki",
];

function copyIcons(to) {
    rmSync(to, { recursive: true, force: true });
    mkdirSync(to, { recursive: true });
    for (const name of ICONS) {
        copyFileSync(join(AIDE, "design/icons/svg", `${name}.svg`), join(to, `${name}.svg`));
    }
    copyFileSync(join(AIDE, "design/icons/LICENSE"), join(to, "LICENSE"));
}

writeFileSync(join(ROOT, "src/styles/tokens.css"), tokensCss(JSON.parse(read("design/tokens.json"))));

mkdirSync(ASSETS, { recursive: true });
copyFileSync(join(AIDE, "design/app-icon/mark.svg"), join(ASSETS, "mark.svg"));
copyFileSync(
    join(AIDE, "ios/Aide/Resources/Assets.xcassets/AppIcon.appiconset/mac-512.png"),
    join(ASSETS, "app-icon.png"),
);
writeFileSync(join(ROOT, "public/favicon.svg"), faviconSvg(read("design/app-icon/mark.svg")));
copyIcons(join(ASSETS, "icons"));
for (const id of ["mochi", "piyo"]) {
    copyFileSync(join(AIDE, `design/characters/${id}.json`), join(ASSETS, `${id}.json`));
}
copyFileSync(join(AIDE, "design/characters/rig.mjs"), join(ROOT, "src/scripts/rig.mjs"));

const source = {
    note: "The AIDE checkout these files were copied from (scripts/sync-from-aide.mjs).",
    commit: git("rev-parse", "--short", "HEAD"),
    release: git("describe", "--tags", "--abbrev=0"),
};
writeFileSync(join(ROOT, "src/data/source.json"), `${JSON.stringify(source, null, 4)}\n`);
console.warn(`synced from ${AIDE} at ${source.commit} (${source.release})`);
