// The reference for design/characters/README.md: reads and checks a rig, samples it into a draw
// list, and plays it (the director). The apps' twins are ios/Aide/Features/Assistant/Character*.swift
// and linux/src/character.rs; spec/fixtures/character.json (written by fixtures.mjs from this) holds
// all three to the same numbers.

export const PROPS = ["tx", "ty", "rot", "sx", "sy", "opacity"];
const ADDITIVE = new Set(["tx", "ty", "rot"]);
export const POSES = ["waiting", "thinking", "listening"];
export const REQUIRED_CLIPS = ["blink", "greet", "attention", "hop", "think"];
/// Clips a rig may have: `breathe` loops while it isn't thinking, `cheer` greets an answer, `poke`
/// answers a pointer over it or a tap.
export const OPTIONAL_CLIPS = ["breathe", "cheer", "poke"];
export const PRIORITY = { attention: 5, greet: 4, cheer: 3, hop: 2, poke: 2 };
/// Frames a second while nothing but `breathe` moves (a calm frame loop, README › How they play).
export const CALM_FPS = 15;
export const BLEND = 0.25;
export const GREET_AFTER = 600;
export const ATTENTION_EVERY = 15;
export const ATTENTION_TIMES = 3;

const neutral = (prop) => (ADDITIVE.has(prop) ? 0 : 1);

/// A colour as [r, g, b, a], 0–1.
function hex(text) {
    const match = /^#([0-9a-fA-F]{6})$/.exec(text ?? "");
    if (!match) return null;
    const value = parseInt(match[1], 16);
    return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255, 1];
}

/// SVG path data, absolute M L C Q Z: [{op, points: [[x, y]…]}] or null.
export function parsePath(data) {
    const tokens = (data ?? "").match(/[MLCQZ]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?|[^\s,]/g) ?? [];
    const counts = { M: 1, L: 1, C: 3, Q: 2, Z: 0 };
    const commands = [];
    let index = 0;
    while (index < tokens.length) {
        const op = tokens[index++];
        if (!(op in counts)) return null;
        const points = [];
        for (let point = 0; point < counts[op]; point++) {
            const x = Number(tokens[index++]);
            const y = Number(tokens[index++]);
            if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
            points.push([x, y]);
        }
        if (commands.length === 0 && op !== "M") return null;
        commands.push({ op, points });
    }
    return commands.length ? commands : null;
}

/// A shape's points (corners for an ellipse or a rect): for bounds and the default pivot.
function shapePoints(shape) {
    if (shape.ellipse) {
        const [cx, cy, rx, ry] = shape.ellipse;
        return [[cx - rx, cy - ry], [cx + rx, cy - ry], [cx + rx, cy + ry], [cx - rx, cy + ry]];
    }
    if (shape.rect) {
        const [x, y, w, h] = shape.rect;
        return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    }
    return shape.commands.flatMap((command) => command.points);
}

function centre(points) {
    const xs = points.map((point) => point[0]);
    const ys = points.map((point) => point[1]);
    return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}

const finite = (value) => typeof value === "number" && Number.isFinite(value);

/// Reads a rig: { rig, problems }. A rig with problems isn't drawn.
export function readRig(json) {
    const problems = [];
    const say = (text) => problems.push(text);
    if (json?.version !== 1) say("version must be 1");
    if (typeof json?.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(json.id)) say("id must be lower-case letters, digits and -");
    if (typeof json?.name !== "string" || !json.name) say("name missing");
    const box = json?.box;
    if (!Array.isArray(box) || box.length !== 2 || !box.every((value) => finite(value) && value > 0)) say("box must be [w, h]");
    const palette = {};
    for (const [name, colour] of Object.entries(json?.palette ?? {})) {
        const spec = typeof colour === "string" ? { base: colour } : colour;
        const alpha = spec.alpha ?? 1;
        const known = (value) => value === "accent" || hex(value) != null;
        if (!finite(alpha) || alpha < 0 || alpha > 1) say(`palette ${name}: alpha must be 0–1`);
        if (spec.base === "accent") palette[name] = { kind: "accent", alpha };
        else if (spec.hex && hex(spec.hex)) palette[name] = { kind: "hex", value: hex(spec.hex), alpha };
        else if (Array.isArray(spec.mix) && spec.mix.length === 2 && spec.mix.every(known) && finite(spec.amount) && spec.amount >= 0 && spec.amount <= 1)
            palette[name] = { kind: "mix", mix: spec.mix, amount: spec.amount, alpha };
        else say(`palette ${name}: not a colour`);
    }
    const ids = new Set(["all"]);
    const groups = {};
    for (const group of json?.groups ?? []) {
        if (ids.has(group.id)) say(`id ${group.id} used twice`);
        ids.add(group.id);
        if (!Array.isArray(group.pivot) || !group.pivot.every(finite)) say(`group ${group.id}: pivot`);
        groups[group.id] = { id: group.id, pivot: group.pivot };
    }
    const parts = [];
    for (const raw of json?.parts ?? []) {
        if (ids.has(raw.id)) say(`id ${raw.id} used twice`);
        ids.add(raw.id);
        const shape = {};
        if (raw.shape?.ellipse) {
            if (raw.shape.ellipse.length !== 4 || !raw.shape.ellipse.every(finite)) say(`part ${raw.id}: ellipse`);
            shape.ellipse = raw.shape.ellipse;
        } else if (raw.shape?.rect) {
            if (raw.shape.rect.length !== 5 || !raw.shape.rect.every(finite)) say(`part ${raw.id}: rect`);
            shape.rect = raw.shape.rect;
        } else if (raw.shape?.path) {
            shape.commands = parsePath(raw.shape.path);
            if (!shape.commands) say(`part ${raw.id}: path`);
        } else say(`part ${raw.id}: shape`);
        if (raw.group != null && !groups[raw.group]) say(`part ${raw.id}: no group ${raw.group}`);
        if (raw.fill != null && !palette[raw.fill]) say(`part ${raw.id}: no colour ${raw.fill}`);
        const stroke = raw.stroke ? { color: raw.stroke.color, width: raw.stroke.width, cap: raw.stroke.cap ?? "round" } : null;
        if (stroke && (!palette[stroke.color] || !finite(stroke.width) || stroke.width <= 0 || !["round", "butt"].includes(stroke.cap)))
            say(`part ${raw.id}: stroke`);
        if (raw.fill == null && !stroke) say(`part ${raw.id}: neither fill nor stroke`);
        const opacity = raw.opacity ?? 1;
        if (!finite(opacity) || opacity < 0 || opacity > 1) say(`part ${raw.id}: opacity`);
        if (raw.pivot != null && !(Array.isArray(raw.pivot) && raw.pivot.length === 2 && raw.pivot.every(finite))) say(`part ${raw.id}: pivot`);
        const ok = shape.ellipse || shape.rect || shape.commands;
        parts.push({
            id: raw.id,
            group: raw.group ?? null,
            shape,
            fill: raw.fill ?? null,
            stroke,
            opacity,
            pivot: raw.pivot ?? (ok ? centre(shapePoints(shape)) : [0, 0]),
        });
    }
    if (!parts.length) say("no parts");
    const targetValues = (where, values) => {
        for (const [target, props] of Object.entries(values ?? {})) {
            if (!ids.has(target)) say(`${where}: no target ${target}`);
            for (const [prop, value] of Object.entries(props)) {
                if (!PROPS.includes(prop)) say(`${where}: no property ${prop}`);
                if (!finite(value)) say(`${where}: ${target}.${prop} must be a number`);
            }
        }
    };
    const poses = {};
    for (const [name, values] of Object.entries(json?.poses ?? {})) {
        if (!POSES.includes(name)) say(`no pose ${name}`);
        targetValues(`pose ${name}`, values);
        poses[name] = values;
    }
    const clips = {};
    for (const [name, raw] of Object.entries(json?.clips ?? {})) {
        if (!(REQUIRED_CLIPS.includes(name) || OPTIONAL_CLIPS.includes(name) || /^idle\.[a-z][a-z0-9-]*$/.test(name))) say(`no clip ${name}`);
        const loop = raw.loop === true;
        if (!finite(raw.duration) || raw.duration <= 0) say(`clip ${name}: duration`);
        const tracks = [];
        for (const [target, props] of Object.entries(raw.tracks ?? {})) {
            if (!ids.has(target)) say(`clip ${name}: no target ${target}`);
            if (name === "blink" && !target.startsWith("eye")) say(`clip blink: ${target} isn't an eye`);
            for (const [prop, keys] of Object.entries(props)) {
                if (!PROPS.includes(prop)) say(`clip ${name}: no property ${prop}`);
                const ok = Array.isArray(keys) && keys.length >= 2 && keys.every((key) => Array.isArray(key) && finite(key[0]) && finite(key[1]) && [undefined, "linear", "ease"].includes(key[2]))
                    && keys[0][0] === 0 && keys[keys.length - 1][0] === 1 && keys.every((key, index) => index === 0 || key[0] > keys[index - 1][0]);
                if (!ok) {
                    say(`clip ${name}: ${target}.${prop} keys`);
                    continue;
                }
                const first = keys[0][1];
                const last = keys[keys.length - 1][1];
                if (loop ? first !== last : first !== neutral(prop) || last !== neutral(prop)) say(`clip ${name}: ${target}.${prop} must ${loop ? "end where it starts" : "start and end neutral"}`);
                tracks.push({ target, prop, keys: keys.map(([t, value, ease]) => ({ t, value, ease: ease === "ease" })) });
            }
        }
        clips[name] = { name, duration: raw.duration, loop, tracks };
    }
    for (const name of REQUIRED_CLIPS) if (!clips[name]) say(`clip ${name} missing`);
    for (const name of ["think", "breathe"]) if (clips[name] && !clips[name].loop) say(`clip ${name} must loop`);
    for (const name of ["blink", "greet", "attention", "hop", "cheer", "poke"]) if (clips[name]?.loop) say(`clip ${name} must not loop`);
    const rig = { id: json?.id, name: json?.name, box, palette, groups, parts, poses, clips, idle: Object.keys(clips).filter((name) => name.startsWith("idle.")).sort() };
    if (!problems.length) problems.push(...envelope(rig));
    return { rig, problems };
}

/// Every target's resting values.
function resting(rig) {
    const values = {};
    for (const target of ["all", ...Object.keys(rig.groups), ...rig.parts.map((part) => part.id)]) values[target] = { tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, opacity: 1 };
    return values;
}

/// The values of the poses that are on, stacked in their order.
export function poseValues(rig, on) {
    const values = resting(rig);
    for (const name of POSES) {
        if (!on[name]) continue;
        for (const [target, props] of Object.entries(rig.poses[name] ?? {})) Object.assign(values[target], props);
    }
    return values;
}

/// Between two sets of values.
export function blendValues(from, to, progress) {
    const p = Math.min(Math.max(progress, 0), 1);
    const values = {};
    for (const [target, props] of Object.entries(to)) {
        values[target] = {};
        for (const prop of PROPS) values[target][prop] = from[target][prop] + (to[target][prop] - from[target][prop]) * p;
    }
    return values;
}

const smooth = (u) => u * u * (3 - 2 * u);

/// A clip's value for one track at `seconds` into it (a loop wraps, a one-shot holds its ends).
function sampleTrack(clip, track, seconds) {
    let u = seconds / clip.duration;
    u = clip.loop ? u - Math.floor(u) : Math.min(Math.max(u, 0), 1);
    const keys = track.keys;
    for (let index = 0; index < keys.length - 1; index++) {
        const [a, b] = [keys[index], keys[index + 1]];
        if (u <= b.t) {
            let local = (u - a.t) / (b.t - a.t);
            if (a.ease) local = smooth(local);
            return a.value + (b.value - a.value) * local;
        }
    }
    return keys[keys.length - 1].value;
}

/// Applies a playing clip (`{clip, at}`, seconds into it) onto values, in place.
function applyClip(values, rig, playing) {
    if (!playing) return;
    const clip = rig.clips[playing.clip];
    if (!clip) return;
    for (const track of clip.tracks) {
        const value = sampleTrack(clip, track, playing.at);
        if (ADDITIVE.has(track.prop)) values[track.target][track.prop] += value;
        else values[track.target][track.prop] *= value;
    }
}

/// What's shown: { pose: values (after any blend), loop, action, blink } -> values per target.
export function compose(rig, frame) {
    const values = structuredClone(frame.pose);
    applyClip(values, rig, frame.loop);
    applyClip(values, rig, frame.action);
    applyClip(values, rig, frame.blink);
    return values;
}

const multiply = (m, n) => [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
];

/// M = T(pivot) · T(tx, ty) · R(rot) · S(sx, sy) · T(−pivot), as [a, b, c, d, e, f].
function matrix(values, pivot) {
    const r = (values.rot * Math.PI) / 180;
    const [cos, sin] = [Math.cos(r), Math.sin(r)];
    const [a, b, c, d] = [cos * values.sx, sin * values.sx, -sin * values.sy, cos * values.sy];
    const [px, py] = pivot;
    return [a, b, c, d, px + values.tx - (a * px + c * py), py + values.ty - (b * px + d * py)];
}

export function resolveColour(rig, name, accent) {
    const spec = rig.palette[name];
    const base = (value) => (value === "accent" ? accent : hex(value));
    let rgb;
    if (spec.kind === "accent") rgb = accent;
    else if (spec.kind === "hex") rgb = spec.value;
    else {
        const [a, b] = spec.mix.map(base);
        rgb = [0, 1, 2].map((index) => a[index] + (b[index] - a[index]) * spec.amount);
    }
    return [rgb[0], rgb[1], rgb[2], spec.alpha];
}

/// The draw list for composed values: per part its matrix (design units), opacity, colours.
export function drawList(rig, values, accent) {
    const all = matrix(values.all, [rig.box[0] / 2, rig.box[1]]);
    return rig.parts.map((part) => {
        let m = all;
        let opacity = values.all.opacity * part.opacity * values[part.id].opacity;
        if (part.group) {
            m = multiply(m, matrix(values[part.group], rig.groups[part.group].pivot));
            opacity *= values[part.group].opacity;
        }
        m = multiply(m, matrix(values[part.id], part.pivot));
        return {
            id: part.id,
            matrix: m,
            opacity,
            fill: part.fill ? resolveColour(rig, part.fill, accent) : null,
            stroke: part.stroke ? { color: resolveColour(rig, part.stroke.color, accent), width: part.stroke.width, cap: part.stroke.cap } : null,
            shape: part.shape,
        };
    });
}

/// Checks that everything stays in the box less a 1-unit margin (README › Checks).
function envelope(rig) {
    const problems = [];
    const combos = [];
    for (let mask = 0; mask < 8; mask++) combos.push(Object.fromEntries(POSES.map((name, index) => [name, (mask >> index) & 1 ? true : false])));
    const actions = [null, ...Object.keys(rig.clips).filter((name) => !["blink", "think", "breathe"].includes(name))];
    const loops = [null, "think", ...(rig.clips.breathe ? ["breathe"] : [])];
    const [w, h] = rig.box;
    for (const on of combos) {
        const pose = poseValues(rig, on);
        for (const action of actions) {
            for (const loopClip of loops) {
                for (const blinking of [false, true]) {
                    for (let step = 0; step <= 60; step++) {
                        const u = step / 60;
                        const at = (name) => ({ clip: name, at: u * rig.clips[name].duration });
                        const values = compose(rig, { pose, loop: loopClip ? at(loopClip) : null, action: action ? at(action) : null, blink: blinking ? at("blink") : null });
                        for (const item of drawList(rig, values, [0, 0, 0])) {
                            if (item.opacity <= 0) continue;
                            const m = item.matrix;
                            const scale = Math.max(Math.hypot(m[0], m[1]), Math.hypot(m[2], m[3]));
                            const widen = item.stroke ? (item.stroke.width / 2) * scale : 0;
                            for (const [x, y] of shapePoints(item.shape)) {
                                const [X, Y] = [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
                                if (X - widen < 1 || Y - widen < 1 || X + widen > w - 1 || Y + widen > h - 1) {
                                    const where = [Object.entries(on).filter(([, v]) => v).map(([k]) => k).join("+") || "resting", action, loopClip, blinking && "blink"].filter(Boolean).join(", ");
                                    problems.push(`${item.id} leaves the box (${where}, at ${u.toFixed(2)})`);
                                    return problems;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return problems;
}

/// mulberry32: the same random numbers in every app, from a seed.
export function random(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/// Plays a rig (README › How they play). `update(now, input)` with input {visible, busy, listening,
/// waiting, bubble (key or null), told, answered, poked (counters)} returns the frame to draw and
/// when to look again.
export class Director {
    constructor(rig, rng, reduceMotion = false) {
        this.rig = rig;
        this.rng = rng;
        this.reduce = reduceMotion;
        this.onScreen = false;
        this.greeted = false;
        this.hiddenAt = null;
        this.on = { waiting: false, thinking: false, listening: false };
        this.blendFrom = null;
        this.blendAt = 0;
        this.action = null;
        this.blink = null;
        this.blinkAt = null;
        this.idleAt = null;
        this.lastIdle = null;
        this.bubble = null;
        this.told = 0;
        this.answered = 0;
        this.poked = 0;
        this.busySince = 0;
        this.shownSince = 0;
    }

    /// Reduce Motion turned on or off while it plays: what plays stops; nothing else is forgotten.
    setReduceMotion(on) {
        this.reduce = on;
        if (on) {
            this.action = null;
            this.blink = null;
            this.blendFrom = null;
        }
    }

    play(name, now) {
        if (this.reduce || !this.rig.clips[name]) return;
        const rank = (clip) => PRIORITY[clip] ?? 1;
        if (this.action && rank(this.action.clip) >= rank(name)) return;
        this.action = { clip: name, start: now };
    }

    poseNow(now) {
        const target = poseValues(this.rig, this.on);
        if (!this.blendFrom) return target;
        return blendValues(this.blendFrom, target, (now - this.blendAt) / BLEND);
    }

    update(now, input) {
        if (!input.visible) {
            if (this.onScreen) {
                this.onScreen = false;
                this.hiddenAt = now;
            }
            this.action = null;
            this.blink = null;
            this.blendFrom = null;
            this.bubble = null;
            this.told = input.told;
            this.answered = input.answered ?? 0;
            this.poked = input.poked ?? 0;
            return null;
        }
        if (!this.onScreen) {
            this.onScreen = true;
            this.on = { waiting: input.waiting, thinking: input.busy, listening: input.listening };
            if (input.busy) this.busySince = now;
            if (!this.greeted || (this.hiddenAt != null && now - this.hiddenAt >= GREET_AFTER)) this.play("greet", now);
            this.greeted = true;
            this.blinkAt = now + 2.5 + this.rng() * 3.5;
            this.idleAt = now + 12 + this.rng() * 18;
            this.told = input.told;
            this.answered = input.answered ?? 0;
            this.poked = input.poked ?? 0;
            this.shownSince = now;
        }
        const on = { waiting: input.waiting, thinking: input.busy, listening: input.listening };
        if (POSES.some((name) => on[name] !== this.on[name])) {
            if (on.thinking && !this.on.thinking) this.busySince = now;
            // Breathing starts over where thinking ends, so it doesn't jump into the middle of a breath.
            if (!on.thinking && this.on.thinking) this.shownSince = now;
            if (!this.reduce) {
                this.blendFrom = this.poseNow(now);
                this.blendAt = now;
            }
            this.on = on;
        }
        if (this.blendFrom && now - this.blendAt >= BLEND) this.blendFrom = null;
        if (input.told !== this.told) {
            this.told = input.told;
            this.play("hop", now);
        }
        if ((input.answered ?? 0) !== this.answered) {
            this.answered = input.answered ?? 0;
            this.play("cheer", now);
        }
        if ((input.poked ?? 0) !== this.poked) {
            this.poked = input.poked ?? 0;
            this.play("poke", now);
        }
        if ((input.bubble ?? null) !== (this.bubble?.key ?? null)) {
            this.bubble = input.bubble == null ? null : { key: input.bubble, times: 1, next: now + ATTENTION_EVERY };
            if (this.bubble) this.play("attention", now);
        } else if (this.bubble && this.bubble.times < ATTENTION_TIMES && now >= this.bubble.next) {
            this.bubble.times += 1;
            this.bubble.next = now + ATTENTION_EVERY;
            this.play("attention", now);
        }
        if (this.action && now - this.action.start >= this.rig.clips[this.action.clip].duration) this.action = null;
        if (this.blink && now - this.blink.start >= this.rig.clips.blink.duration) this.blink = null;
        if (!this.reduce && !this.blink && now >= this.blinkAt) {
            this.blink = { clip: "blink", start: now };
            this.blinkAt = now + 2.5 + this.rng() * 3.5;
        }
        if (now >= this.idleAt) {
            if (!this.action && !on.thinking && !on.listening && this.rig.idle.length && !this.reduce) {
                const choices = this.rig.idle.length > 1 ? this.rig.idle.filter((name) => name !== this.lastIdle) : this.rig.idle;
                const pick = choices[Math.min(Math.floor(this.rng() * choices.length), choices.length - 1)];
                this.lastIdle = pick;
                this.play(pick, now);
            }
            this.idleAt = now + 12 + this.rng() * 18;
        }
        const breathing = !on.thinking && !this.reduce && this.rig.clips.breathe;
        const loop = this.reduce ? null : on.thinking ? { clip: "think", at: now - this.busySince } : breathing ? { clip: "breathe", at: now - this.shownSince } : null;
        const action = this.action ? { clip: this.action.clip, at: now - this.action.start } : null;
        const blink = this.blink ? { clip: "blink", at: now - this.blink.start } : null;
        const animating = Boolean(loop || action || blink || this.blendFrom);
        // Only breathing: frames at CALM_FPS, not every display frame.
        const calm = animating && loop?.clip === "breathe" && !action && !blink && !this.blendFrom;
        const wakes = [this.blinkAt, this.idleAt, this.bubble && this.bubble.times < ATTENTION_TIMES ? this.bubble.next : null].filter((value) => value != null && !this.reduce);
        return { pose: this.poseNow(now), loop, action, blink, animating, calm, wake: wakes.length ? Math.min(...wakes) : null };
    }
}
