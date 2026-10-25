// Copies what the site shares with AIDE from a checkout of the (private) AIDE repo, so the build
// itself never needs it: the design tokens as CSS, the app mark, the icon set, the assistant's
// characters and the plugins' manifests the manual documents, and the public plugin index's list. Run it when AIDE changes:
// `AIDE_REPO=~/dev/aide node scripts/sync-from-aide.mjs`.
//
// `--check` copies nothing: it exits 1 when the plugins' manifests differ from src/data/plugins.json,
// so a plugin change in AIDE can't land without the manual (AIDE's scripts/docs-check.sh runs it).
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

import { faviconSvg } from "./lib/favicon.mjs";
import { changedPlugins, pluginsJson } from "./lib/plugins.mjs";
import { tokensCss } from "./lib/tokens.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const AIDE = resolve(process.env.AIDE_REPO ?? join(homedir(), "dev/aide"));
const ASSETS = join(ROOT, "src/assets/aide");

const PLUGINS = join(ROOT, "src/data/plugins.json");

if (process.argv.includes("--check")) {
    const current = existsSync(PLUGINS) ? readFileSync(PLUGINS, "utf8") : "{}";
    let now;
    try {
        now = pluginsJson(AIDE);
    } catch (error) {
        console.error(`docs check: couldn't read AIDE's plugins at ${AIDE} (is Go installed?): ${error.message}`);
        process.exit(2);
    }
    const changed = changedPlugins(JSON.parse(current), JSON.parse(now));
    if (changed.length === 0) process.exit(0);
    console.error(
        `AIDE's plugins changed since the manual was written (${changed.join(", ")}): in aide-site, run ` +
            `\`AIDE_REPO=${AIDE} node scripts/sync-from-aide.mjs\`, update those plugins' pages and commit both.`,
    );
    process.exit(1);
}

const read = (path) => readFileSync(join(AIDE, path), "utf8");
const git = (...args) => execFileSync("git", ["-C", AIDE, ...args], { encoding: "utf8" }).trim();

// The icons the site draws, from AIDE's set (Phosphor, MIT); the names are design/icons.json's.
const ICONS = [
    "assistant",
    "bell",
    "calendar",
    "devices",
    "feed",
    "folder",
    "graph",
    "grid",
    "inbox",
    "key",
    "mic",
    "organize",
    "people",
    "plugin",
    "review",
    "scratch",
    "scribble",
    "search",
    "server",
    "settings",
    "terminal",
    "text-size",
    "timer",
    "today",
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

writeFileSync(PLUGINS, pluginsJson(AIDE));

// The public plugin index the apps install from: each plugin it lists gets a page at /plugins/<id>/
// (the iPhone app's universal link to it, App Review 4.7).
const INDEX = "https://marshallku.github.io/aide-plugins/plugins.json";
const index = await (await fetch(INDEX)).json();
const community = {
    note: `The public plugin index (${INDEX}), as scripts/sync-from-aide.mjs last read it.`,
    plugins: index.plugins.map(({ id, name, description, author, version, capabilities, repo, updated }) => ({
        id,
        name,
        description,
        author,
        version,
        capabilities: capabilities ?? [],
        repo,
        updated,
    })),
};
writeFileSync(join(ROOT, "src/data/community-plugins.json"), `${JSON.stringify(community, null, 4)}\n`);

const source = {
    note: "The AIDE checkout these files were copied from (scripts/sync-from-aide.mjs).",
    commit: git("rev-parse", "--short", "HEAD"),
    release: git("describe", "--tags", "--abbrev=0"),
};
writeFileSync(join(ROOT, "src/data/source.json"), `${JSON.stringify(source, null, 4)}\n`);
console.warn(`synced from ${AIDE} at ${source.commit} (${source.release})`);
