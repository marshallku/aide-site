// The landing page's small behaviours: reveal on scroll, the theme switch (shared with Starlight's
// "starlight-theme" setting, so the manual opens in the same theme), the hero's platform and the copy
// buttons.

const THEME_KEY = "starlight-theme";

function readTheme(): string {
    try {
        return localStorage.getItem(THEME_KEY) ?? "";
    } catch {
        return "";
    }
}

function writeTheme(theme: string) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
        // Private windows: the switch still works for this page.
    }
}

function setupReveal() {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal], [data-play]");
    if (!("IntersectionObserver" in window)) {
        targets.forEach((target) => target.classList.add("is-in"));
        return;
    }
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const target = entry.target as HTMLElement;
                // [data-play] scenes run only while they are on screen; [data-reveal] reveals once.
                if (target.hasAttribute("data-play")) {
                    target.classList.toggle("is-playing", entry.isIntersecting);
                }
                if (entry.isIntersecting) {
                    target.classList.add("is-in");
                    if (!target.hasAttribute("data-play")) observer.unobserve(target);
                }
            }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    targets.forEach((target) => observer.observe(target));
}

function setupThemeSwitch() {
    for (const button of document.querySelectorAll<HTMLButtonElement>("[data-theme-switch]")) {
        button.addEventListener("click", () => {
            const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            document.documentElement.dataset.theme = next;
            writeTheme(next);
        });
    }
    // Following the system while nothing is chosen.
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
        if (readTheme()) return;
        document.documentElement.dataset.theme = event.matches ? "dark" : "light";
    });
}

// The hero offers the Mac; on Linux it offers the install script instead. The download section lists both.
function setupPlatform() {
    const agent = navigator.userAgent;
    if (!agent.includes("Linux") || agent.includes("Android")) return;
    document.querySelectorAll("[data-mac-only]").forEach((element) => element.remove());
    for (const element of document.querySelectorAll<HTMLElement>("[data-linux-label]")) {
        element.textContent = element.dataset.linuxLabel ?? "";
    }
    for (const button of document.querySelectorAll<HTMLButtonElement>("[data-linux-command]")) {
        const command = button.dataset.linuxCommand ?? "";
        button.dataset.copy = command;
        const code = button.querySelector("code");
        if (code) code.textContent = command;
    }
}

function setupCopyButtons() {
    for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
        const label = button.querySelector("[data-copy-label]");
        const idle = label?.textContent ?? "";
        button.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy ?? "");
            } catch {
                return;
            }
            if (!label) return;
            label.textContent = button.dataset.copied ?? idle;
            setTimeout(() => (label.textContent = idle), 1600);
        });
    }
}

document.documentElement.classList.remove("no-js");
setupReveal();
setupThemeSwitch();
setupPlatform();
setupCopyButtons();
