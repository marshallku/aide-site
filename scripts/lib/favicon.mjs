// The app icon as an SVG favicon: AIDE's mark on the icon's tile, with the colours and proportions
// design/app-icon/generate.py uses.

const TILE_TOP = "#2b2d52";
const TILE_BOTTOM = "#5856d6";
const MARK_CENTER = [624, 628];
const MARK_HEIGHT = 950;
const MARK_SHARE = 0.6;
const SIZE = 1254;

export function faviconSvg(markSvg) {
    const path = /<path[^>]*\bd="([^"]+)"/.exec(markSvg)?.[1];
    if (!path) throw new Error("the mark has no path");
    const scale = (SIZE * MARK_SHARE) / MARK_HEIGHT;
    const transform = `translate(${SIZE / 2} ${SIZE / 2}) scale(${scale.toFixed(4)}) translate(${-MARK_CENTER[0]} ${-MARK_CENTER[1]})`;
    return [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">`,
        `<defs><linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">`,
        `<stop offset="0" stop-color="${TILE_TOP}"/><stop offset="1" stop-color="${TILE_BOTTOM}"/>`,
        `</linearGradient></defs>`,
        `<rect width="${SIZE}" height="${SIZE}" rx="${SIZE * 0.225}" fill="url(#tile)"/>`,
        `<path transform="${transform}" fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="${path}"/>`,
        `</svg>`,
        "",
    ].join("\n");
}
