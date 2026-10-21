# aide-site

The public homepage (`src/pages/`) and manual (`src/content/docs/`) of AIDE. AIDE's source is a
private repository (`marshallku/aide`, usually `~/dev/aide`); this site is public, so everything here
must make sense to someone who can't see that repository.

## Keeping the manual true

- Every fact comes from AIDE's source: the code, `spec/`, `i18n/strings.json`, the plugins'
  manifests. Nothing is guessed. When the source doesn't settle something, leave it out.
- The manual describes the release in `src/data/source.json` (`release`). Something merged but not
  released is left out, or marked `<Badge text="Next release" />` / `<Badge text="다음 릴리스" />`.
- `scripts/sync-from-aide.mjs` copies what the site shares with AIDE (tokens, mark, icons, characters,
  `src/data/plugins.json`). Run it after AIDE changes; `--check` exits 1 when the plugins changed
  and names them. AIDE's `scripts/docs-check.sh` runs that check.
- A plugin page's settings table is `<PluginSettings>`, rendered from the manifest. The page supplies
  each setting's default; a setting added or removed in AIDE fails the build until the page says
  what its default is.
- `pnpm test` fails when an English page has no Korean twin (or the reverse), or a plugin in
  `plugins.json` has no page under `docs/plugins/<id>`.

## Writing

- Plain, concrete English in the second person. Short sentences. Say what happens, where, and when.
  No marketing words (seamless, powerful, effortless, unleash, supercharge), no exclamation marks.
- UI labels exactly as the app shows them (`i18n/strings.json`), in bold, with `›` between levels:
  **Settings › Notifications**. Keys in `<kbd>`: <kbd>⌘</kbd><kbd>O</kbd>.
- Korean pages use 해요체 and the app's own Korean labels (설정 › 플러그인), the way the app's Korean
  strings read. Code, paths, setting keys and commands stay as they are.
- Never point readers at AIDE's private files (`plugins/README.md`, `spec/…`, ADR numbers) or at the
  author's own machine. Describe the behaviour instead.
- Each page: frontmatter `title`, a one-sentence `description`, `sidebar.order`. Open with what the
  thing is for in one or two sentences, then how to use it, then details and limits.
- Use Starlight's components where they help (`Steps`, `Tabs`/`TabItem`, `Aside`, `Card`, `CardGrid`,
  `LinkCard`, `Badge`) from `@astrojs/starlight/components`. Links between pages are absolute:
  `/docs/plugins/slack/` (`/ko/docs/plugins/slack/` on Korean pages).

### A plugin page (`docs/plugins/<id>.mdx`)

1. One or two sentences: what it does for you.
2. `<PluginFacts id="<id>" />` (add `kind="device"` for a device plugin).
3. **What it does** — the behaviour, concretely: when it runs, what it writes where, what it pushes.
4. **Before you start** — what it needs (accounts, tokens, a desktop host, other plugins).
5. **Set it up** — numbered `<Steps>`, starting from where the reader is (the plugin in Settings: under **On the server** on the Mac and iPhone, **Settings › Plugins** on Linux).
6. **Settings** — `<PluginSettings id="<id>" defaults={{ … }} />`, then any setting that needs more
   than its one-line help.
7. **Troubleshooting** — headings that are the symptom ("The briefing didn't arrive"), then the fix.
8. **Privacy** — what leaves the computer, to whom, and what's stored where.

## Code

TypeScript and Astro, Prettier (120 columns, 4 spaces, double quotes), `#` path aliases from
`tsconfig.json`. `pnpm format:check && pnpm check && pnpm test && pnpm build` before committing;
the build also validates every internal link. Commit through `~/save.sh` after a cross-review.

## The landing page

`src/pages/index.astro` (English) and `src/pages/ko/index.astro` (Korean) share their sections in
`src/components/landing/`, with the words in `src/lib/landing-copy.ts`. The product pictures are
HTML built from AIDE's tokens, not screenshots; motion stops under `prefers-reduced-motion` and when
off screen.
