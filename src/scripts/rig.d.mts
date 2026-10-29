// Types for rig.mjs (AIDE's character renderer, copied verbatim from the app repository).

export type Rgba = [number, number, number, number];

export interface Shape {
    ellipse?: [number, number, number, number];
    rect?: [number, number, number, number, number];
    commands?: { op: "M" | "L" | "C" | "Q" | "Z"; points: [number, number][] }[];
}

export interface DrawItem {
    id: string;
    matrix: [number, number, number, number, number, number];
    opacity: number;
    fill: Rgba | null;
    stroke: { color: Rgba; width: number; cap: "round" | "butt" } | null;
    shape: Shape;
}

export interface Rig {
    box: [number, number];
    clips: Record<string, { duration: number }>;
    idle: string[];
}

export interface Frame {
    pose: unknown;
    loop: unknown;
    action: unknown;
    blink: unknown;
    animating: boolean;
    /// Only breathing moves: CALM_FPS frames a second will do.
    calm: boolean;
    wake: number | null;
}

export interface DirectorInput {
    visible: boolean;
    waiting: boolean;
    busy: boolean;
    listening: boolean;
    told: number;
    answered?: number;
    poked?: number;
    bubble?: string | null;
}

export const CALM_FPS: number;

export function readRig(json: unknown): { rig: Rig; problems: string[] };
export function compose(rig: Rig, frame: Frame): unknown;
export function drawList(rig: Rig, values: unknown, accent: [number, number, number]): DrawItem[];
export function random(seed: number): () => number;

export class Director {
    constructor(rig: Rig, rng: () => number, reduceMotion?: boolean);
    play(name: string, now: number): void;
    setReduceMotion(on: boolean): void;
    update(now: number, input: DirectorInput): Frame | null;
}
