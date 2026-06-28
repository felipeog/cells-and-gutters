import {
  DEBUG,
  DEBUG_MARGIN_X,
  DEBUG_MARGIN_Y,
  SVG_WIDTH,
  SVG_HEIGHT,
} from "../constants/defaultConfig";

const svg = document.querySelector("svg") as SVGSVGElement;
const x1 = DEBUG ? -1 * DEBUG_MARGIN_X : 0;
const y1 = DEBUG ? -1 * DEBUG_MARGIN_Y : 0;
const x2 = DEBUG ? SVG_WIDTH + 2 * DEBUG_MARGIN_X : SVG_WIDTH;
const y2 = DEBUG ? SVG_HEIGHT + 2 * DEBUG_MARGIN_Y : SVG_HEIGHT;

svg.setAttribute("viewBox", `${x1} ${y1} ${x2} ${y2}`);

export const elements = {
  svg,
};
