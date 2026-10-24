// The landing page's words in English and Korean. The sections in src/components/landing/ take
// `copy` from here, so both pages always have the same sections.

export type Lang = "en" | "ko";

const en = {
    meta: {
        title: "AIDE — a personal assistant you own",
        description:
            "Notes and todos in plain Markdown, a scratchpad that files itself into your wiki, a feed sorted by what it needs from you, plugins and an assistant. On your Mac, Linux and iPhone, with a server that is yours.",
    },
    nav: { features: "Features", plugins: "Plugins", docs: "Docs", download: "Download", theme: "Switch theme" },
    hero: {
        eyebrow: "Notes · Todos · Feed · Plugins · Assistant",
        title: ["A personal assistant", "you own, end to end."],
        lede: "AIDE keeps your notes and todos as plain Markdown, files what you jot down into your wiki, and sorts everything that happens around you by what it needs from you. On your Mac, your Linux desktop and your iPhone, with a server that is yours.",
        primary: "Download for Mac",
        primaryLinux: "Download for Linux",
        secondary: "Read the manual",
        copy: "Copy",
        copied: "Copied",
        requirements: "macOS 14+ · Linux x86_64 · iPhone in TestFlight beta",
    },
    stage: {
        today: "Thursday, October 22",
        todayMeta: "daily/2026-10-22 · 3 open",
        briefing: "Morning briefing",
        briefingLines: [
            "Clear, 14°C → 19°C. Light jacket in the morning.",
            "Design review at 10:30, 1:1 with Jiwoo at 15:00.",
            "Start with the release notes; they block the 14:00 build.",
        ],
        todos: "Today",
        todoItems: [
            { text: "Write the v0.5 release notes", done: true, meta: "⏳ 09:00" },
            { text: "Review the onboarding copy", done: false, meta: "📅 today" },
            { text: "Reply to Mina about the venue", done: false, meta: "#home" },
        ],
        agenda: "Agenda",
        agendaItems: ["10:30 Design review", "15:00 1:1 with Jiwoo", "19:00 Dinner at Mina's"],
        rail: ["Scratch", "Wiki", "Todos", "Feed", "Calendar", "Assistant"],
        panelTitle: "Wiki",
        panelItems: ["Today", "This week", "topics", "meetings", "people", "briefings"],
        saved: "Saved",
        phoneTitle: "Feed",
    },
    buckets: { action: "Act on", need: "Need to know", interest: "Might interest you", rest: "Everything else" },
    feedItems: [
        { bucket: "action", title: "Reply to Mina about the venue", meta: "gmail · 2 min ago" },
        { bucket: "action", title: "In 10 minutes: Design review", meta: "calendar · Join call" },
        { bucket: "need", title: "Evening recap ready", meta: "recap · yesterday" },
        { bucket: "need", title: "3 cards to review today", meta: "recall · 08:00" },
        { bucket: "interest", title: "This week's life benefits", meta: "benefits · Monday" },
        { bucket: "interest", title: "Saved from Slack: #design launch thread", meta: "slack · 1 h ago" },
    ],
    write: {
        eyebrow: "Write",
        title: "An editor you already know how to use.",
        body: "Live-preview Markdown with [[links]], embeds, tables and properties, in tabs on the desktop. Notes are plain files in a folder, so an Obsidian vault opens as it is: its daily notes, its Tasks and Dataview fields, its drawings.",
        points: [
            "Daily, weekly, monthly, quarterly and yearly notes from your templates",
            "Links to headings and blocks, with a graph of everything",
            "Six editor themes and nine accents, light and dark",
        ],
        note: {
            title: "Launch plan",
            lines: ["The plan lives in [[", "and the open questions are in"],
            suggestion: ["topics/launch-checklist", "meetings/2026-10-20-kickoff", "people/jiwoo"],
        },
    },
    capture: {
        eyebrow: "Capture",
        title: "Jot it down. AIDE finds it a home.",
        body: "Anything typed into an empty tab is a scratch note; on the Mac, ⌥Space opens a quick-capture panel anywhere. When you're ready, Organize proposes where each note belongs in your wiki. You check the ones you like and press Apply.",
        points: [
            "Applied notes are archived from Scratch, never deleted",
            "Without an AI, rules file them: a #tag, a todo, or the inbox",
            "Nothing moves until you say so",
        ],
        scratch: [
            { text: "venue: ask Mina about the 14th", home: "topics/wedding", kind: "append" },
            { text: "#reading Thinking in Systems ch. 3", home: "topics/reading", kind: "new page" },
            { text: "- [ ] renew passport before Dec", home: "daily/2026-10-22", kind: "append" },
        ],
        propose: "Propose",
        apply: "Apply 3",
    },
    feed: {
        eyebrow: "Feed",
        title: "Everything that happens, sorted by what it needs from you.",
        body: "Plugins, scripts and services post events into one log you own. AIDE reads each one and files it under Act on, Need to know or Might interest you; the rest waits, collapsed. Act on, and Need to know unless you turn it off, come up as notifications on your desktop; the rest waits in the Feed.",
        points: [
            "Mail that needs a reply, meetings about to start, cards to review",
            "Anything that can send an HTTP request can post to it",
            "Triage by your AI, or by rules when there is none",
        ],
    },
    day: {
        eyebrow: "Your day",
        title: "A day that writes its own notes.",
        body: "Server plugins work on a schedule while you get on with it. They write into sections of your notes they own, so your own words stay yours, and they speak your language.",
        moments: [
            {
                time: "07:00",
                title: "Morning briefing",
                text: "Weather, the next three days, three todos to start with.",
            },
            { time: "−10 min", title: "Before each meeting", text: "A reminder, then prep from your related notes." },
            { time: "18:00", title: "Mail", text: "What needs a reply and what you're still waiting on." },
            { time: "21:15", title: "Open loops", text: "Your list of open issues, kept current from today." },
            { time: "21:30", title: "Evening recap", text: "What moved, what slipped, what carries over." },
            { time: "22:30", title: "Recall", text: "Flashcards from what you wrote today, for tomorrow." },
        ],
    },
    assistant: {
        eyebrow: "Assistant",
        title: "An assistant that proposes, and never presumes.",
        body: "Plan your day in a chat that sees your todos, your calendar and your free time. It answers with proposals you take or drop, and keeps its memory in notes you can read. It speaks first at the start and end of the day, and before meetings.",
        points: [
            "Lives on your desktop as Mochi or Piyo, with speech bubbles",
            "Voice stays on the device; audio is never stored or sent",
            "Radar watches your Slack and coding sessions and tells you what matters",
        ],
        chat: {
            you: "Plan my afternoon. I need two hours for the release notes.",
            them: "You're free 13:00–15:00 before your 1:1. I'd put the release notes there and move the onboarding review to tomorrow morning.",
            proposals: [
                { text: "Schedule “Write the release notes” 13:00–15:00", kind: "schedule" },
                { text: "Move “Review the onboarding copy” to tomorrow", kind: "move" },
            ],
            take: "Take",
            drop: "Drop",
            bubble: "Ask Kim now: he leaves at 19:00.",
        },
    },
    plugins: {
        eyebrow: "Plugins",
        title: "Plugins for the rest of your life.",
        body: "Server plugins run beside your notes on a schedule: calendar, mail, Slack, git, briefings. Device plugins run in a sandbox on every device, with only the access you approve.",
        server: "Server plugins",
        device: "Device plugins",
        more: "How plugins work",
        next: "Next release",
    },
    own: {
        eyebrow: "Yours",
        title: "Yours, all the way down.",
        pillars: [
            {
                title: "Your files",
                text: "Notes are Markdown files in a folder you choose. Copy them, sync them with git, open them in Obsidian. Nothing is deleted for good.",
            },
            {
                title: "Your server",
                text: "Keep notes on one device, host them on your Mac or Linux desktop, or run your own server. Devices pair with you, over TLS.",
            },
            {
                title: "Your model",
                text: "Claude Code, Codex or an Anthropic key on your terms, or no AI at all: AIDE falls back to rules and keeps working.",
            },
        ],
        facts: [
            "Voice and meeting audio are transcribed on the device",
            "Plugin secrets are sealed on your server and never shown back",
            "Folders you mark Never read are never sent to a model",
        ],
    },
    platforms: {
        eyebrow: "Download",
        title: "On the Mac, on Linux, and soon on your iPhone.",
        mac: { name: "Mac", req: "macOS 14 or later · Apple silicon and Intel" },
        linux: { name: "Linux", req: "x86_64 · GTK 4 and libadwaita" },
        iphone: { name: "iPhone", req: "iOS 17 or later", status: "In TestFlight beta, not public yet" },
        macScript: "Or the install script",
        linuxArch: "First the GTK libraries, on Arch",
        linuxUbuntu: "Or on Ubuntu",
        linuxScript: "Then the install script, without sudo",
        releases: "All releases",
    },
    closing: {
        title: "Start with a folder of notes.",
        body: "Everything else — the server, the plugins, the assistant — can come later, one at a time.",
        docs: "Get started",
    },
    footer: {
        tagline: "A personal assistant you own, end to end.",
        product: "Product",
        manual: "Manual",
        links: {
            intro: "What is AIDE",
            install: "Install",
            plugins: "Plugins",
            selfHost: "Host on your desktop",
            developers: "aidectl",
            privacy: "Privacy and security",
            releases: "Releases",
        },
        language: "Language",
        version: "Manual for AIDE",
    },
};

type Copy = typeof en;

const ko: Copy = {
    meta: {
        title: "AIDE — 내가 가진 개인 비서",
        description:
            "평범한 마크다운으로 남는 노트와 할 일, 알아서 위키로 정리되는 스크래치, 무엇을 해야 하는지로 나뉘는 피드, 플러그인과 어시스턴트. Mac, Linux, iPhone에서, 내 서버와 함께.",
    },
    nav: { features: "기능", plugins: "플러그인", docs: "문서", download: "다운로드", theme: "테마 바꾸기" },
    hero: {
        eyebrow: "노트 · 할 일 · 피드 · 플러그인 · 어시스턴트",
        title: ["처음부터 끝까지,", "내가 가진 개인 비서."],
        lede: "AIDE는 노트와 할 일을 평범한 마크다운으로 남기고, 대충 적어 둔 메모를 위키로 옮겨 주고, 주변에서 일어나는 일을 내가 해야 할 일에 따라 나눠 줘요. Mac과 Linux 데스크톱, iPhone에서 돌아가고, 서버도 내 것이에요.",
        primary: "Mac용 다운로드",
        primaryLinux: "Linux용 다운로드",
        secondary: "설명서 읽기",
        copy: "복사",
        copied: "복사됨",
        requirements: "macOS 14 이상 · Linux x86_64 · iPhone은 TestFlight 베타",
    },
    stage: {
        today: "10월 22일 목요일",
        todayMeta: "daily/2026-10-22 · 열린 할 일 3개",
        briefing: "아침 브리핑",
        briefingLines: [
            "맑음, 14°C → 19°C. 아침엔 가벼운 겉옷을 챙기세요.",
            "10:30 디자인 리뷰, 15:00 지우와 1:1.",
            "릴리스 노트부터 시작하세요. 14:00 빌드가 기다리고 있어요.",
        ],
        todos: "오늘",
        todoItems: [
            { text: "v0.5 릴리스 노트 쓰기", done: true, meta: "⏳ 09:00" },
            { text: "온보딩 문구 검토하기", done: false, meta: "📅 오늘" },
            { text: "미나에게 장소 답장하기", done: false, meta: "#home" },
        ],
        agenda: "일정",
        agendaItems: ["10:30 디자인 리뷰", "15:00 지우와 1:1", "19:00 미나네 저녁"],
        rail: ["스크래치", "위키", "할 일", "피드", "캘린더", "어시스턴트"],
        panelTitle: "위키",
        panelItems: ["오늘", "이번 주", "topics", "meetings", "people", "briefings"],
        saved: "저장됨",
        phoneTitle: "피드",
    },
    buckets: { action: "조치 필요", need: "알아둘 내용", interest: "관심 있을 만한 내용", rest: "나머지" },
    feedItems: [
        { bucket: "action", title: "미나에게 장소 답장하기", meta: "gmail · 2분 전" },
        { bucket: "action", title: "10분 후: 디자인 리뷰", meta: "calendar · 통화 참여" },
        { bucket: "need", title: "저녁 정리 완료", meta: "recap · 어제" },
        { bucket: "need", title: "오늘 복습할 카드 3장", meta: "recall · 08:00" },
        { bucket: "interest", title: "이번 주 생활 혜택", meta: "benefits · 월요일" },
        { bucket: "interest", title: "Slack에서 저장함: #design 출시 스레드", meta: "slack · 1시간 전" },
    ],
    write: {
        eyebrow: "쓰기",
        title: "이미 쓸 줄 아는 에디터.",
        body: "[[링크]], 임베드, 표, 속성을 그대로 보며 쓰는 마크다운 에디터예요. 데스크톱에선 탭으로 열어요. 노트는 폴더 속 평범한 파일이라 옵시디언 보관소도 그대로 열려요. 데일리 노트, Tasks와 Dataview 필드, 그림까지요.",
        points: [
            "템플릿으로 만드는 일간·주간·월간·분기·연간 노트",
            "제목과 블록까지 가는 링크, 모든 노트를 잇는 그래프",
            "에디터 테마 6가지와 강조 색 9가지, 라이트와 다크",
        ],
        note: {
            title: "출시 계획",
            lines: ["계획은 [[", "열린 질문은 여기에 있어요:"],
            suggestion: ["topics/launch-checklist", "meetings/2026-10-20-kickoff", "people/jiwoo"],
        },
    },
    capture: {
        eyebrow: "기록",
        title: "일단 적어 두세요. 자리는 AIDE가 찾아요.",
        body: "빈 탭에 입력한 건 모두 스크래치 노트가 돼요. Mac에선 어디서든 ⌥Space로 빠른 메모를 열 수 있어요. 준비가 되면 정리가 각 노트가 위키의 어디에 들어가면 좋을지 제안해요. 마음에 드는 것만 골라 적용하면 돼요.",
        points: [
            "적용한 노트는 스크래치에서 보관될 뿐, 지워지지 않아요",
            "AI가 없으면 규칙대로 정리해요: #태그, 할 일, 받은 편지함",
            "내가 정하기 전엔 아무것도 옮겨지지 않아요",
        ],
        scratch: [
            { text: "장소: 14일 건 미나에게 물어보기", home: "topics/wedding", kind: "덧붙이기" },
            { text: "#reading 시스템 사고 3장", home: "topics/reading", kind: "새 페이지" },
            { text: "- [ ] 12월 전에 여권 갱신", home: "daily/2026-10-22", kind: "덧붙이기" },
        ],
        propose: "제안",
        apply: "3개 적용",
    },
    feed: {
        eyebrow: "피드",
        title: "일어나는 모든 일을, 내가 할 일에 따라 나눠요.",
        body: "플러그인과 스크립트, 서비스가 내 것인 하나의 로그에 이벤트를 남겨요. AIDE가 하나씩 읽고 조치 필요, 알아둘 내용, 관심 있을 만한 내용으로 나눠요. 나머지는 접힌 채 기다려요. 조치 필요와, 끄지 않았다면 알아둘 내용도 데스크톱에 알림으로 뜨고, 나머지는 피드에서 기다려요.",
        points: [
            "답장이 필요한 메일, 곧 시작할 회의, 복습할 카드",
            "HTTP 요청을 보낼 수 있는 건 무엇이든 이벤트를 올릴 수 있어요",
            "내 AI가 분류하고, AI가 없으면 규칙이 분류해요",
        ],
    },
    day: {
        eyebrow: "하루",
        title: "스스로 노트를 쓰는 하루.",
        body: "서버 플러그인은 내가 할 일을 하는 동안 정해진 시간에 움직여요. 노트 안의 자기 구역에만 쓰기 때문에 내가 쓴 글은 그대로 남고, 내 언어로 써요.",
        moments: [
            { time: "07:00", title: "아침 브리핑", text: "날씨, 앞으로 사흘의 일정, 먼저 할 일 세 가지." },
            { time: "10분 전", title: "회의마다", text: "알림이 오고, 관련 노트로 준비할 내용을 정리해요." },
            { time: "18:00", title: "메일", text: "답장이 필요한 메일과 아직 답을 기다리는 메일." },
            { time: "21:15", title: "열린 이슈", text: "오늘을 반영해 열린 이슈 목록을 최신으로 유지해요." },
            { time: "21:30", title: "저녁 정리", text: "진행된 일, 밀린 일, 내일로 넘길 일." },
            { time: "22:30", title: "Recall", text: "오늘 쓴 글로 내일 복습할 카드를 만들어요." },
        ],
    },
    assistant: {
        eyebrow: "어시스턴트",
        title: "제안할 뿐, 멋대로 하지 않는 비서.",
        body: "할 일과 캘린더, 비는 시간을 보는 대화로 하루를 계획해요. 답은 적용하거나 버릴 수 있는 제안으로 오고, 기억은 내가 읽을 수 있는 노트에 남겨요. 하루의 시작과 끝, 회의 전에는 먼저 말을 걸어요.",
        points: [
            "데스크톱에서 모찌나 삐요로 말풍선과 함께 지내요",
            "음성은 기기 안에서만 처리하고, 녹음을 저장하거나 보내지 않아요",
            "레이더가 Slack과 코딩 세션을 살피고 중요한 걸 알려 줘요",
        ],
        chat: {
            you: "오후 계획 짜 줘. 릴리스 노트에 두 시간이 필요해.",
            them: "1:1 전 13:00–15:00이 비어 있어요. 릴리스 노트는 거기에 두고, 온보딩 검토는 내일 아침으로 옮기면 좋겠어요.",
            proposals: [
                { text: "“릴리스 노트 쓰기”를 13:00–15:00에 배치", kind: "schedule" },
                { text: "“온보딩 문구 검토하기”를 내일로 이동", kind: "move" },
            ],
            take: "적용",
            drop: "버리기",
            bubble: "지금 김 님께 물어보세요. 19:00에 퇴근해요.",
        },
    },
    plugins: {
        eyebrow: "플러그인",
        title: "삶의 나머지를 위한 플러그인.",
        body: "서버 플러그인은 노트 곁에서 정해진 시간에 돌아가요. 캘린더, 메일, Slack, git, 브리핑. 기기 플러그인은 모든 기기에서 샌드박스 안에 돌아가고, 내가 허락한 만큼만 접근해요.",
        server: "서버 플러그인",
        device: "기기 플러그인",
        more: "플러그인 동작 방식",
        next: "다음 릴리스",
    },
    own: {
        eyebrow: "내 것",
        title: "처음부터 끝까지, 전부 내 것.",
        pillars: [
            {
                title: "내 파일",
                text: "노트는 내가 고른 폴더 속 마크다운 파일이에요. 복사하고, git으로 동기화하고, 옵시디언으로 열 수 있어요. 영영 지워지는 건 없어요.",
            },
            {
                title: "내 서버",
                text: "노트를 한 기기에만 두거나, Mac이나 Linux 데스크톱에서 호스팅하거나, 직접 서버를 운영하세요. 기기는 TLS로 나와 연결돼요.",
            },
            {
                title: "내 모델",
                text: "Claude Code, Codex, Anthropic 키를 원하는 대로 쓰거나, AI 없이 써도 돼요. AIDE는 규칙으로 계속 동작해요.",
            },
        ],
        facts: [
            "음성과 회의 녹음은 기기 안에서 글로 옮겨요",
            "플러그인 비밀 값은 내 서버에 봉인되고 다시 보여 주지 않아요",
            "읽지 않을 폴더로 지정한 곳은 모델에 보내지 않아요",
        ],
    },
    platforms: {
        eyebrow: "다운로드",
        title: "Mac과 Linux에서, 곧 iPhone에서도.",
        mac: { name: "Mac", req: "macOS 14 이상 · Apple 실리콘과 Intel" },
        linux: { name: "Linux", req: "x86_64 · GTK 4와 libadwaita" },
        iphone: { name: "iPhone", req: "iOS 17 이상", status: "TestFlight 베타 중, 아직 공개 전" },
        macScript: "또는 설치 스크립트",
        linuxArch: "먼저 GTK 라이브러리를 설치해요. Arch에서는",
        linuxUbuntu: "Ubuntu에서는",
        linuxScript: "그다음 설치 스크립트를 실행해요. sudo는 필요 없어요",
        releases: "모든 릴리스",
    },
    closing: {
        title: "노트 폴더 하나로 시작하세요.",
        body: "서버도, 플러그인도, 어시스턴트도 나중에 하나씩 더하면 돼요.",
        docs: "시작하기",
    },
    footer: {
        tagline: "처음부터 끝까지, 내가 가진 개인 비서.",
        product: "제품",
        manual: "설명서",
        links: {
            intro: "AIDE 소개",
            install: "설치",
            plugins: "플러그인",
            selfHost: "데스크톱에서 호스팅",
            developers: "aidectl",
            privacy: "개인정보와 보안",
            releases: "릴리스",
        },
        language: "언어",
        version: "설명서 기준 AIDE",
    },
};

export const COPY: Record<Lang, Copy> = { en, ko };

export const BREW = "brew install --cask marshallku/tap/aide";
export const INSTALLER =
    "curl -fsSL https://github.com/marshallku/aide-releases/releases/latest/download/install.sh | bash";
// The libraries the Linux app takes from the distribution; install.sh names the same when one is missing.
export const LINUX_LIBRARIES = {
    arch: "sudo pacman -S gtk4 libadwaita webkitgtk-6.0 libheif vte4 gst-plugins-good gst-plugins-bad",
    ubuntu: "sudo apt install libgtk-4-1 libadwaita-1-0 libwebkitgtk-6.0-4 libheif1 libvte-2.91-gtk4-0 gstreamer1.0-plugins-good gstreamer1.0-plugins-bad",
};
export const RELEASES = "https://github.com/marshallku/aide-releases/releases";

/// A docs path in the page's language: `/docs/x/` or `/ko/docs/x/`.
export const docsHref = (lang: Lang, path: string) => `${lang === "ko" ? "/ko" : ""}/docs/${path}/`;

/// One line per plugin for the landing page's grid (the manifests' descriptions are for Settings).
// Plugins in AIDE's main branch that no release carries yet: the grid marks them.
export const NEXT_RELEASE = new Set(["github", "linear", "jira"]);

export const PLUGIN_BLURBS: Record<Lang, Record<string, string>> = {
    en: {
        "todo-carry": "Carries yesterday's open todos into today's daily note.",
        gcal: "Google calendars in the app, reminders and AI prep before each event.",
        "docs-sync": "Two-way sync of your notes with a git repository.",
        briefing: "At 07:00: weather, your schedule and three todos to start with.",
        recap: "At 21:30: what moved, what slipped, what carries over.",
        loops: "Keeps your note of open issues current from each day.",
        benefits: "Weekly: Korean life-stage benefits that match your profile.",
        recall: "Nightly flashcards from what you wrote, and a reminder to review.",
        gmail: "Read-only: mail that needs a reply, and what you're waiting on.",
        catchup: "Each night, your Claude Code and Codex sessions written into your notes.",
        slack: "Save to AIDE: a whole Slack thread into a note, with a summary.",
        radar: "Watches your Slack and coding sessions and tells you what matters.",
        github: "Your assignments, review requests and mentions in one place.",
        linear: "Your Linear issues, mentions and deadlines in one place.",
        jira: "Your open Jira work and deadlines in one place.",
        eisenhower: "Your open todos in a do / schedule / delegate / later grid.",
        kanban: "Boards of cards in lanes, kept in notes the way Obsidian's Kanban writes them.",
        excalidraw: "Draw in your notes; drawings stay plain SVG files.",
        pomodoro: "A 25/5 focus timer that logs your sessions each evening.",
        "word-count": "The word count of the note you're reading, in the side panel.",
    },
    ko: {
        "todo-carry": "어제 끝내지 못한 할 일을 오늘 데일리 노트로 옮겨요.",
        gcal: "Google 캘린더를 앱에서 보고, 일정 전에 알림과 AI 준비 노트를 받아요.",
        "docs-sync": "노트를 git 저장소와 양방향으로 동기화해요.",
        briefing: "07:00에 날씨, 일정, 먼저 할 일 세 가지를 정리해요.",
        recap: "21:30에 진행된 일, 밀린 일, 넘길 일을 정리해요.",
        loops: "열린 이슈 노트를 매일 최신으로 유지해요.",
        benefits: "매주 프로필에 맞는 생활 혜택을 찾아 줘요.",
        recall: "밤마다 쓴 글로 복습 카드를 만들고, 아침에 알려 줘요.",
        gmail: "읽기 전용: 답장이 필요한 메일과 답을 기다리는 메일.",
        catchup: "밤마다 Claude Code와 Codex 세션을 노트에 정리해요.",
        slack: "AIDE에 저장: Slack 스레드 전체를 요약과 함께 노트로.",
        radar: "Slack과 코딩 세션을 살피고 중요한 걸 알려 줘요.",
        github: "할당된 작업, 리뷰 요청, 멘션을 한곳에.",
        linear: "Linear 이슈, 멘션, 마감일을 한곳에.",
        jira: "진행 중인 Jira 작업과 마감일을 한곳에.",
        eisenhower: "열린 할 일을 지금 하기·일정 잡기·위임·나중에로 나눠요.",
        kanban: "레인과 카드로 된 보드를 Obsidian Kanban과 같은 형식의 노트에 보관해요.",
        excalidraw: "노트 안에 그림을 그리고, 그림은 평범한 SVG로 남아요.",
        pomodoro: "25/5 집중 타이머, 저녁마다 세션을 기록해요.",
        "word-count": "읽고 있는 노트의 단어 수를 사이드 패널에 보여 줘요.",
    },
};
