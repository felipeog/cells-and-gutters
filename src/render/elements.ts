import { DEBUG, DEBUG_MARGIN, SVG_SIZE } from "../constants/defaultConfig";

const svg = document.querySelector("svg") as SVGSVGElement;
const x1 = DEBUG ? -1 * DEBUG_MARGIN : 0;
const y1 = DEBUG ? -1 * DEBUG_MARGIN : 0;
const x2 = DEBUG ? SVG_SIZE + 2 * DEBUG_MARGIN : SVG_SIZE;
const y2 = DEBUG ? SVG_SIZE + 2 * DEBUG_MARGIN : SVG_SIZE;

svg.setAttribute("viewBox", `${x1} ${y1} ${x2} ${y2}`);

export const elements = {
  svg,
};
