import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";

const group = (label, ko, directory) => ({
    label,
    translations: { ko },
    items: [{ autogenerate: { directory: `docs/${directory}` } }],
});

export default defineConfig({
    site: "https://aide.marshallku.dev",
    trailingSlash: "ignore",
    integrations: [
        starlight({
            title: "AIDE",
            plugins: [starlightLinksValidator({ errorOnLocalLinks: false })],
            description: "A personal assistant you own end to end: notes, todos, a feed triaged by AI, and plugins.",
            logo: { src: "./src/assets/aide/app-icon.png", alt: "AIDE" },
            favicon: "/favicon.svg",
            defaultLocale: "root",
            locales: {
                root: { label: "English", lang: "en" },
                ko: { label: "한국어", lang: "ko" },
            },
            social: [{ icon: "github", label: "Releases", href: "https://github.com/marshallku/aide-releases" }],
            editLink: { baseUrl: "https://github.com/marshallku/aide-site/edit/master/" },
            customCss: ["./src/styles/fonts.css", "./src/styles/tokens.css", "./src/styles/starlight.css"],
            sidebar: [
                group("Getting started", "시작하기", "getting-started"),
                group("Using AIDE", "AIDE 사용하기", "guides"),
                group("Plugins", "플러그인", "plugins"),
                group("Self-hosting", "직접 호스팅", "self-hosting"),
                group("Developers", "개발자", "developers"),
            ],
        }),
    ],
});
