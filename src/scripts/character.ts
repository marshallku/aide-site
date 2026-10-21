// AIDE's desktop character on a canvas, drawn by the app's own rig renderer and director
// (rig.mjs), so it moves on the page as it does on a Mac or Linux desktop: it greets when it comes
// on screen, blinks, idles, hops when touched, thinks while the assistant works and calls for
// attention when it has something to say.

import { Director, compose, drawList, random, readRig, type DrawItem, type Shape } from "./rig.mjs";

import mochi from "#assets/aide/mochi.json";
import piyo from "#assets/aide/piyo.json";

const RIGS = { mochi, piyo } as const;

export interface CharacterState {
    busy: boolean;
    bubble: string | null;
}

export interface Character {
    set(state: Partial<CharacterState>): void;
    poke(): void;
    dispose(): void;
}

function shapePath(shape: Shape): Path2D {
    const path = new Path2D();
    if (shape.ellipse) {
        const [cx, cy, rx, ry] = shape.ellipse;
        path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    } else if (shape.rect) {
        const [x, y, w, h, r] = shape.rect;
        path.roundRect(x, y, w, h, r);
    } else {
        for (const { op, points } of shape.commands ?? []) {
            const flat = points.flat() as number[];
            if (op === "M") path.moveTo(flat[0], flat[1]);
            else if (op === "L") path.lineTo(flat[0], flat[1]);
            else if (op === "C") path.bezierCurveTo(flat[0], flat[1], flat[2], flat[3], flat[4], flat[5]);
            else if (op === "Q") path.quadraticCurveTo(flat[0], flat[1], flat[2], flat[3]);
            else path.closePath();
        }
    }
    return path;
}

const css = ([r, g, b, a]: [number, number, number, number]) =>
    `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`;

function hexColour(text: string): [number, number, number] {
    const value = parseInt(text.trim().replace("#", ""), 16);
    return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

export function mountCharacter(
    canvas: HTMLCanvasElement,
    options: { id: keyof typeof RIGS; accent: string; seed?: number },
): Character {
    const { rig } = readRig(RIGS[options.id]);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const director = new Director(rig, random(options.seed ?? 7), reduce.matches);
    const accent = hexColour(options.accent);
    const context = canvas.getContext("2d");
    const paths = new Map<string, Path2D>();
    const state: CharacterState = { busy: false, bubble: null };
    let told = 0;
    let onScreen = false;
    let frameId = 0;
    let wakeTimer = 0;

    const pathFor = (item: DrawItem) => {
        let path = paths.get(item.id);
        if (!path) {
            path = shapePath(item.shape);
            paths.set(item.id, path);
        }
        return path;
    };

    const resize = () => {
        const ratio = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * ratio);
        canvas.height = Math.round(canvas.clientHeight * ratio);
    };

    /// Draws the frame for `now`; whether it is still moving and when it next wants to (director).
    const draw = (now: number): { animating: boolean; wake: number | null } => {
        if (!context) return { animating: false, wake: null };
        const frame = director.update(now, {
            visible: true,
            waiting: false,
            busy: state.busy,
            listening: false,
            told,
            bubble: state.bubble,
        });
        if (!frame) return { animating: false, wake: null };
        const [boxW, boxH] = rig.box;
        const scale = Math.min(canvas.width / boxW, canvas.height / boxH);
        const offsetX = (canvas.width - boxW * scale) / 2;
        const offsetY = (canvas.height - boxH * scale) / 2;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (const item of drawList(rig, compose(rig, frame), accent)) {
            if (item.opacity <= 0) continue;
            const [a, b, c, d, e, f] = item.matrix;
            context.setTransform(scale, 0, 0, scale, offsetX, offsetY);
            context.transform(a, b, c, d, e, f);
            context.globalAlpha = Math.min(1, item.opacity);
            const path = pathFor(item);
            if (item.fill) {
                context.fillStyle = css(item.fill);
                context.fill(path);
            }
            if (item.stroke) {
                context.strokeStyle = css(item.stroke.color);
                context.lineWidth = item.stroke.width;
                context.lineCap = item.stroke.cap;
                context.lineJoin = "round";
                context.stroke(path);
            }
        }
        context.globalAlpha = 1;
        return { animating: frame.animating, wake: frame.wake };
    };

    // Frames only while something moves; a still character sleeps until its next blink or idle.
    const tick = (time: number) => {
        frameId = 0;
        const now = time / 1000;
        const { animating, wake } = draw(now);
        if (!onScreen || document.hidden) return;
        if (animating) {
            frameId = requestAnimationFrame(tick);
        } else if (wake != null) {
            wakeTimer = window.setTimeout(start, Math.max(0, (wake - now) * 1000));
        }
    };

    function start() {
        clearTimeout(wakeTimer);
        if (!frameId && onScreen && !document.hidden) frameId = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        start();
    });
    const resizeObserver = new ResizeObserver(() => {
        resize();
        draw(performance.now() / 1000);
    });
    const onVisibility = () => start();
    const onMotion = () => {
        director.setReduceMotion(reduce.matches);
        start();
    };

    resize();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", onMotion);

    return {
        set(next) {
            Object.assign(state, next);
            start();
        },
        poke() {
            told += 1;
            start();
        },
        dispose() {
            cancelAnimationFrame(frameId);
            clearTimeout(wakeTimer);
            observer.disconnect();
            resizeObserver.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            reduce.removeEventListener("change", onMotion);
        },
    };
}
