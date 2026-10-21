// design/tokens.json (AIDE's design system) → CSS custom properties, light by default and dark
// under prefers-color-scheme / Starlight's data-theme.

const HEADER = "/* Generated from AIDE's design/tokens.json by scripts/sync-from-aide.mjs. Do not edit. */";

const declarations = (pairs) => pairs.map(([name, value]) => `    --${name}: ${value};`).join("\n");

export function tokensCss(tokens) {
    const colors = tokens.color.tokens.filter((token) => typeof token.value === "object");
    const light = colors.map((token) => [token.name, token.value.light]);
    const dark = colors.map((token) => [token.name, token.value.dark]);
    const scalars = [...tokens.spacing.tokens, ...tokens.radius.tokens].map((token) => [token.name, token.value]);
    const families = Object.entries(tokens.type.families).map(([name, value]) => [`font-${name}`, value]);

    return [
        HEADER,
        `:root {\n${declarations([...scalars, ...families, ...light])}\n}`,
        `:root[data-theme="dark"] {\n${declarations(dark)}\n}`,
        `@media (prefers-color-scheme: dark) {\n    :root:not([data-theme="light"]) {\n${declarations(dark)
            .split("\n")
            .map((line) => `    ${line}`)
            .join("\n")}\n    }\n}`,
        "",
    ].join("\n\n");
}
