// The public plugin index's plugins (src/data/community-plugins.json) for /plugins/: each one's page
// is the iPhone app's universal link to it, and what it asks for reads as the app's consent screen.

import data from "#data/community-plugins.json";
import plugins from "#data/plugins.json";
import type { CommunityPlugin, Locale } from "#lib/capabilities";

export { describeCapability, reportHref, type CommunityPlugin } from "#lib/capabilities";

export const COMMUNITY_PLUGINS: CommunityPlugin[] = data.plugins;

/// The manual has a page for the plugins AIDE's own community folder ships.
export const hasManualPage = (id: string) => plugins.device.some((plugin) => plugin.id === id);

/// The plugin's name and description in the reader's language: its manifest's translation when AIDE
/// ships it (src/data/plugins.json), else the index's English.
export function shown(plugin: CommunityPlugin, locale: Locale): { name: string; description: string } {
    const device = plugins.device.find((entry) => entry.id === plugin.id) as
        { locales?: Record<string, Record<string, unknown>> } | undefined;
    const translated = locale === "en" ? undefined : device?.locales?.[locale];
    const text = (key: string, fallback: string) =>
        typeof translated?.[key] === "string" ? (translated[key] as string) : fallback;
    return { name: text("name", plugin.name), description: text("description", plugin.description) };
}
