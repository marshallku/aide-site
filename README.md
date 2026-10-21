# aide-site

The homepage and manual of [AIDE](https://aide.marshallku.dev), a personal assistant you own end to end.
Astro + Starlight, English at `/` and Korean at `/ko/`.

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # dist/, with the search index and the link check
pnpm check && pnpm test && pnpm format:check
```

## Where things are

- `src/pages/` — the landing page (`index.astro`, `ko/index.astro`).
- `src/content/docs/docs/` — the manual in English; `src/content/docs/ko/docs/` — the same pages in Korean.
- `src/styles/` — fonts, AIDE's design tokens (`tokens.css`, generated) and Starlight's theme.
- `src/assets/aide/`, `src/scripts/rig.mjs`, `public/favicon.svg`, `src/data/source.json` — copied from the
  AIDE repository by `scripts/sync-from-aide.mjs` (the app mark and icon, icons, the assistant's characters
  and their renderer). AIDE's source is private, so the copies are committed; run
  `AIDE_REPO=~/dev/aide node scripts/sync-from-aide.mjs` when AIDE's design changes.

## Deploying

A push to `master` runs `.github/workflows/deploy.yml`: the checks, then `ghcr.io/marshallku/aide-site:<sha>`
(nginx on 8080, `/healthz`), then the image tag in `marshallku/manifest`
(`kubernetes/apps/aide-site/values.yaml`), which ArgoCD rolls out. It needs the repository secret
`MANIFEST_REPO_TOKEN`.
