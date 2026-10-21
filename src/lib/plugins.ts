// Typed access to src/data/plugins.json (AIDE's plugin manifests) in the reader's language.

import data from "#data/plugins.json";

export type Locale = "en" | "ko";

export interface SettingField {
    key: string;
    title: string;
    type: string;
    options?: string[];
    help?: string;
    link?: { title: string; url: string };
}

type Locales = Record<string, Record<string, string | string[]>>;

interface ServerEntry {
    id: string;
    manifest: {
        name: string;
        description: string;
        version: string;
        publishes?: string[];
        slots?: string[];
        schedules?: string[];
        settings?: SettingField[];
        locales?: Locales;
    };
    scopes: string[];
}

interface DeviceEntry {
    id: string;
    name: string;
    version: string;
    description: string;
    render: string;
    capabilities?: string[];
    tabs?: { id: string; title: string }[];
    panels?: { id: string; title: string }[];
    sheets?: { id: string; title: string }[];
    schedules?: { id: string; at?: string; every?: string }[];
    settings?: SettingField[];
    locales?: Locales;
}

export interface Plugin {
    id: string;
    kind: "server" | "device";
    name: string;
    description: string;
    version: string;
    settings: SettingField[];
    /// Server: token scopes; device: capabilities the owner approves at install.
    access: string[];
    schedules: string[];
    publishes: string[];
    render?: string;
}

const server = data.server as unknown as ServerEntry[];
const device = data.device as unknown as DeviceEntry[];

export const toLocale = (lang: string | undefined): Locale => (lang?.startsWith("ko") ? "ko" : "en");

function localize(locales: Locales | undefined, locale: Locale) {
    const table = locale === "en" ? undefined : locales?.[locale];
    const text = (path: string, fallback: string) => {
        const value = table?.[path];
        return typeof value === "string" ? value : fallback;
    };
    const setting = (field: SettingField): SettingField => {
        const options = table?.[`settings.${field.key}.options`];
        return {
            ...field,
            title: text(`settings.${field.key}.title`, field.title),
            help: field.help === undefined ? undefined : text(`settings.${field.key}.help`, field.help),
            options: Array.isArray(options) && options.length === field.options?.length ? options : field.options,
            link: field.link && { ...field.link, title: text(`settings.${field.key}.link`, field.link.title) },
        };
    };
    return { text, setting };
}

function deviceSchedule(schedule: { id: string; at?: string; every?: string }) {
    return schedule.at ? `${schedule.id} ${schedule.at}` : `${schedule.id} every ${schedule.every}`;
}

export function findPlugin(id: string, kind: Plugin["kind"], locale: Locale): Plugin {
    if (kind === "server") {
        const entry = server.find((plugin) => plugin.id === id);
        if (!entry) throw new Error(`no server plugin ${id} in src/data/plugins.json`);
        const { text, setting } = localize(entry.manifest.locales, locale);
        return {
            id,
            kind,
            name: text("name", entry.manifest.name),
            description: text("description", entry.manifest.description),
            version: entry.manifest.version,
            settings: (entry.manifest.settings ?? []).map(setting),
            access: entry.scopes,
            schedules: entry.manifest.schedules ?? [],
            publishes: entry.manifest.publishes ?? [],
        };
    }
    const entry = device.find((plugin) => plugin.id === id);
    if (!entry) throw new Error(`no device plugin ${id} in src/data/plugins.json`);
    const { text, setting } = localize(entry.locales, locale);
    return {
        id,
        kind,
        name: text("name", entry.name),
        description: text("description", entry.description),
        version: entry.version,
        settings: (entry.settings ?? []).map(setting),
        access: entry.capabilities ?? [],
        schedules: (entry.schedules ?? []).map(deviceSchedule),
        publishes: [],
        render: entry.render,
    };
}

export const serverPluginIds = () => server.map((plugin) => plugin.id);
export const devicePluginIds = () => device.map((plugin) => plugin.id);
