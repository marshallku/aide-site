// What a community plugin asks for in words, and where to report it: kept free of the site's data
// and path aliases so the tests can import it as is.

export type Locale = "en" | "ko";

export interface CommunityPlugin {
    id: string;
    name: string;
    description: string;
    author?: string;
    version: string;
    capabilities: string[];
    repo?: string;
    updated?: string;
}

/// The capability as the app's install screen says it (its i18n catalog's wording).
export function describeCapability(capability: string, locale: Locale): string {
    const fixed: Record<string, [string, string]> = {
        "todos:read": ["Read your todos, open and done, in any note", "모든 노트에서 미완료 및 완료된 할 일 읽기"],
        "todos:write": ["Check off and add todos, in any note", "모든 노트에서 할 일 완료 및 추가"],
        storage: ["Keep its own data on this device", "이 기기에 플러그인 데이터 보관"],
        schedule: [
            "Run at set times while AIDE is open on this computer",
            "이 컴퓨터에서 AIDE가 열려 있는 동안 정해진 시간에 실행",
        ],
        "attachments:read": ["Read the images and documents your notes show", "노트에 표시되는 이미지와 문서 읽기"],
        "attachments:write": ["Add images and documents to your notes", "노트에 이미지와 문서 추가"],
    };
    const pick = ([en, ko]: [string, string]) => (locale === "ko" ? ko : en);
    if (fixed[capability]) return pick(fixed[capability]);
    const [kind, ...rest] = capability.split(":");
    const target = rest.join(":");
    if (kind === "net") return pick([`Connect to ${target}`, `${target}에 연결`]);
    const [mode, path] = [rest[0], rest.slice(1).join(":")];
    if (kind === "notes" && mode === "read") {
        return path === "*"
            ? pick(["Read and search all notes", "모든 노트 읽기 및 검색"])
            : pick([`Read and search notes in ${path}`, `${path}의 노트 읽기 및 검색`]);
    }
    if (kind === "notes" && mode === "write") {
        return path === "*"
            ? pick(["Read, change and archive all notes", "모든 노트 읽기, 변경 및 보관"])
            : pick([`Read, change and archive notes in ${path}`, `${path}의 노트 읽기, 변경 및 보관`]);
    }
    return capability;
}

/// A new issue on the repository the index names for the plugin, with its "Report a plugin" template.
export function reportHref(plugin: CommunityPlugin): string | undefined {
    if (!plugin.repo?.startsWith("https://github.com/")) return undefined;
    const title = encodeURIComponent(`Report: ${plugin.id} ${plugin.version}`);
    return `${plugin.repo.replace(/\/$/, "")}/issues/new?template=report-plugin.md&title=${title}`;
}
