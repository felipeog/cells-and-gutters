import { PAGE_WIDTH, PAGE_HEIGHT } from "../constants/defaultConfig";

const svg = document.querySelector("svg") as SVGSVGElement;

svg.setAttribute("width", `${PAGE_WIDTH}mm`);
svg.setAttribute("height", `${PAGE_HEIGHT}mm`);
svg.setAttribute("viewBox", `0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}`);

export const elements = {
  svg,
};
