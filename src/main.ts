import "./style.css";
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  CELL_RADIUS_X,
  CELL_RADIUS_Y,
  GUTTER_SIZE,
  MATRIX_LENGTH,
  SVG_WIDTH,
  SVG_HEIGHT,
  SEED,
  DEBUG,
  NOISE_STEP,
} from "./constants/defaultConfig";
import { createSeededMatrix } from "./helpers/createSeededMatrix";
import { createSvgElement } from "./helpers/createSvgElement";
import { isEven } from "./helpers/isEven";
import { elements } from "./render/elements";

/**
 * TODO:
 * - separate sections into files
 * - separate debug from rendering
 * - form
 *   - cell amount
 *   - cell width input
 *   - cell height input
 *   - gutter width input
 *   - gutter height input
 *   - gutter dead end toggle
 *   - seed input
 *   - noise step input
 *   - debug toggle
 */

const matrix = createSeededMatrix({
  seed: SEED,
  matrixLength: MATRIX_LENGTH,
  noiseStep: NOISE_STEP,
  shouldRemoveDeadEnd: true,
});

// TODO: move debugging
if (DEBUG) {
  let gridD = "";

  for (let i = 0; i < MATRIX_LENGTH + 3; i++) {
    if (isEven(i)) {
      const index = i / 2;
      const yOffset = index * CELL_HEIGHT + index * GUTTER_SIZE;
      const xOffset = index * CELL_WIDTH + index * GUTTER_SIZE;

      gridD += `M ${0 - GUTTER_SIZE} ${yOffset} L ${SVG_WIDTH + GUTTER_SIZE} ${yOffset} `;
      gridD += `M ${xOffset} ${0 - GUTTER_SIZE} L ${xOffset} ${SVG_HEIGHT + GUTTER_SIZE} `;
    } else {
      const index = Math.floor(i / 2);
      const yOffset = index * CELL_HEIGHT + (index - 1) * GUTTER_SIZE;
      const xOffset = index * CELL_WIDTH + (index - 1) * GUTTER_SIZE;

      gridD += `M ${0 - GUTTER_SIZE} ${yOffset} L ${SVG_WIDTH + GUTTER_SIZE} ${yOffset} `;
      gridD += `M ${xOffset} ${0 - GUTTER_SIZE} L ${xOffset} ${SVG_HEIGHT + GUTTER_SIZE} `;
    }
  }

  const gridPath = createSvgElement("path", {
    "data-type": "grid",
    stroke: "rgb(0 0 0 / 0.2)",
    "stroke-width": "1",
    fill: "none",
    d: gridD,
  });

  elements.svg.append(gridPath);
}

// TODO: move debugging
if (DEBUG) {
  for (let row = 0; row < MATRIX_LENGTH; row++) {
    const isRowEven = isEven(row);

    for (let col = 0; col < MATRIX_LENGTH; col++) {
      const isColEven = isEven(col);

      if (isRowEven && !isColEven) {
        const rowIndex = row / 2;
        const colIndex = Math.floor(col / 2);

        const rowOffset = rowIndex * CELL_HEIGHT + rowIndex * GUTTER_SIZE;
        const colOffset =
          colIndex * CELL_WIDTH + colIndex * GUTTER_SIZE + CELL_WIDTH;

        const text = createSvgElement("text", {
          "data-type": "gutter-value",
          "data-row": String(row),
          "data-col": String(col),
          x: String(colOffset + GUTTER_SIZE / 2),
          y: String(rowOffset + CELL_HEIGHT / 2),
          stroke: "none",
          fill: "rgb(0 0 0 / 0.5)",
          "dominant-baseline": "middle",
          "text-anchor": "middle",
          "font-size": "8",
          "font-family": "sans-serif",
        });
        text.textContent = String(Number(matrix[row][col]));

        elements.svg.append(text);
      }

      if (!isRowEven && isColEven) {
        const rowIndex = Math.floor(row / 2);
        const colIndex = col / 2;

        const rowOffset =
          rowIndex * CELL_HEIGHT + rowIndex * GUTTER_SIZE + CELL_HEIGHT;
        const colOffset = colIndex * CELL_WIDTH + colIndex * GUTTER_SIZE;

        const text = createSvgElement("text", {
          "data-type": "gutter-value",
          "data-row": String(row),
          "data-col": String(col),
          x: String(colOffset + CELL_WIDTH / 2),
          y: String(rowOffset + GUTTER_SIZE / 2),
          stroke: "none",
          fill: "rgb(0 0 0 / 0.5)",
          "dominant-baseline": "middle",
          "text-anchor": "middle",
          "font-size": "8",
          "font-family": "sans-serif",
        });
        text.textContent = String(Number(matrix[row][col]));

        elements.svg.append(text);
      }
    }
  }
}

// TODO: move cells rendering
const cellStart = 0;
const cellEnd = MATRIX_LENGTH;

let cellD = "";

for (let row = cellStart; row < cellEnd; row++) {
  const isRowEven = isEven(row);

  for (let col = cellStart; col < cellEnd; col++) {
    const isColEven = isEven(col);

    if (!isRowEven || !isColEven) continue;

    const top = matrix?.[row - 1]?.[col] ?? false;
    const right = matrix?.[row]?.[col + 1] ?? false;
    const bottom = matrix?.[row + 1]?.[col] ?? false;
    const left = matrix?.[row]?.[col - 1] ?? false;

    const rowIndex = row / 2;
    const colIndex = col / 2;
    const rowOffset = rowIndex * CELL_HEIGHT + rowIndex * GUTTER_SIZE;
    const colOffset = colIndex * CELL_WIDTH + colIndex * GUTTER_SIZE;

    // TODO: move debugging
    if (DEBUG) {
      const cellCircle = createSvgElement("circle", {
        "data-type": "cell-position",
        "data-row": String(row),
        "data-col": String(col),
        "data-top": String(top),
        "data-right": String(right),
        "data-bottom": String(bottom),
        "data-left": String(left),
        cx: String(colOffset + CELL_WIDTH / 2),
        cy: String(rowOffset + CELL_HEIGHT / 2),
        r: "2",
        stroke: "none",
        fill: "rgb(255 0 0 / 0.2)",
      });

      elements.svg.append(cellCircle);
    }

    if (!top && !right) {
      cellD += `M ${colOffset + CELL_RADIUS_X} ${rowOffset} `;
      cellD += `A ${CELL_RADIUS_X} ${CELL_RADIUS_Y} 0 0 1 ${colOffset + CELL_WIDTH} ${rowOffset + CELL_RADIUS_Y} `;
    }

    if (!right && !bottom) {
      cellD += `M ${colOffset + CELL_WIDTH} ${rowOffset + CELL_RADIUS_Y} `;
      cellD += `A ${CELL_RADIUS_X} ${CELL_RADIUS_Y} 0 0 1 ${colOffset + CELL_RADIUS_X} ${rowOffset + CELL_HEIGHT} `;
    }

    if (!bottom && !left) {
      cellD += `M ${colOffset + CELL_RADIUS_X} ${rowOffset + CELL_HEIGHT} `;
      cellD += `A ${CELL_RADIUS_X} ${CELL_RADIUS_Y} 0 0 1 ${colOffset} ${rowOffset + CELL_RADIUS_Y} `;
    }

    if (!left && !top) {
      cellD += `M ${colOffset} ${rowOffset + CELL_RADIUS_Y} `;
      cellD += `A ${CELL_RADIUS_X} ${CELL_RADIUS_Y} 0 0 1 ${colOffset + CELL_RADIUS_X} ${rowOffset} `;
    }
  }
}

// TODO: move gutters rendering
const gutterStart = cellStart - 1;
const gutterEnd = cellEnd + 1;

let gutterD = "";

for (let row = gutterStart; row < gutterEnd; row++) {
  const isRowEven = isEven(row);

  for (let col = gutterStart; col < gutterEnd; col++) {
    const isColEven = isEven(col);

    if (isRowEven || isColEven) continue;

    const top = matrix?.[row - 1]?.[col] ?? false;
    const right = matrix?.[row]?.[col + 1] ?? false;
    const bottom = matrix?.[row + 1]?.[col] ?? false;
    const left = matrix?.[row]?.[col - 1] ?? false;

    const rowIndex = Math.ceil(row / 2);
    const colIndex = Math.ceil(col / 2);
    const rowOffset = rowIndex * CELL_HEIGHT + (rowIndex - 1) * GUTTER_SIZE;
    const colOffset = colIndex * CELL_WIDTH + (colIndex - 1) * GUTTER_SIZE;

    // TODO: move debugging
    if (DEBUG) {
      const gutterCircle = createSvgElement("circle", {
        "data-type": "gutter-position",
        "data-row": String(row),
        "data-col": String(col),
        "data-top": String(top),
        "data-right": String(right),
        "data-bottom": String(bottom),
        "data-left": String(left),
        cx: String(colOffset + GUTTER_SIZE / 2),
        cy: String(rowOffset + GUTTER_SIZE / 2),
        r: "2",
        stroke: "none",
        fill: "rgb(0 0 255 / 0.2)",
      });

      elements.svg.append(gutterCircle);
    }

    const amount = Number(top) + Number(right) + Number(bottom) + Number(left);

    if (amount < 1 || amount > 3) continue;

    if (amount === 3) {
      const r = GUTTER_SIZE / 2;

      if (!top) {
        gutterD += `M ${colOffset + GUTTER_SIZE} ${rowOffset - CELL_HEIGHT / 2} `;
        gutterD += `A ${r} ${r} 0 0 1 ${colOffset} ${rowOffset - CELL_HEIGHT / 2} `;
      }

      if (!right) {
        gutterD += `M ${colOffset + GUTTER_SIZE + CELL_WIDTH / 2} ${rowOffset + GUTTER_SIZE} `;
        gutterD += `A ${r} ${r} 0 0 1 ${colOffset + GUTTER_SIZE + CELL_WIDTH / 2} ${rowOffset} `;
      }

      if (!bottom) {
        gutterD += `M ${colOffset} ${rowOffset + GUTTER_SIZE + CELL_HEIGHT / 2} `;
        gutterD += `A ${r} ${r} 0 0 1 ${colOffset + GUTTER_SIZE} ${rowOffset + GUTTER_SIZE + CELL_HEIGHT / 2} `;
      }

      if (!left) {
        gutterD += `M ${colOffset - CELL_WIDTH / 2} ${rowOffset} `;
        gutterD += `A ${r} ${r} 0 0 1 ${colOffset - CELL_WIDTH / 2} ${rowOffset + GUTTER_SIZE} `;
      }

      continue;
    }

    const isCurve =
      (top && right) || (right && bottom) || (bottom && left) || (left && top);

    if (amount === 2 && isCurve) {
      const rx = (CELL_WIDTH + 2 * GUTTER_SIZE) / 2;
      const ry = (CELL_HEIGHT + 2 * GUTTER_SIZE) / 2;

      if (top && right) {
        gutterD += `M ${colOffset - CELL_WIDTH / 2} ${rowOffset} `;
        gutterD += `A ${rx} ${ry} 0 0 1 ${colOffset + GUTTER_SIZE} ${rowOffset + GUTTER_SIZE + CELL_HEIGHT / 2} `;
      }

      if (right && bottom) {
        gutterD += `M ${colOffset + GUTTER_SIZE} ${rowOffset - CELL_HEIGHT / 2} `;
        gutterD += `A ${rx} ${ry} 0 0 1 ${colOffset - CELL_WIDTH / 2} ${rowOffset + GUTTER_SIZE} `;
      }

      if (bottom && left) {
        gutterD += `M ${colOffset + GUTTER_SIZE + CELL_WIDTH / 2} ${rowOffset + GUTTER_SIZE} `;
        gutterD += `A ${rx} ${ry} 0 0 1 ${colOffset} ${rowOffset - CELL_HEIGHT / 2} `;
      }

      if (left && top) {
        gutterD += `M ${colOffset} ${rowOffset + GUTTER_SIZE + CELL_HEIGHT / 2} `;
        gutterD += `A ${rx} ${ry} 0 0 1 ${colOffset + GUTTER_SIZE + CELL_WIDTH / 2} ${rowOffset} `;
      }

      continue;
    }

    if (top) {
      gutterD += `M ${colOffset - CELL_WIDTH / 2} ${rowOffset} `;
      gutterD += `L ${colOffset + GUTTER_SIZE + CELL_WIDTH / 2} ${rowOffset} `;
    }

    if (right) {
      gutterD += `M ${colOffset + GUTTER_SIZE} ${rowOffset - CELL_HEIGHT / 2} `;
      gutterD += `L ${colOffset + GUTTER_SIZE} ${rowOffset + GUTTER_SIZE + CELL_HEIGHT / 2} `;
    }

    if (bottom) {
      gutterD += `M ${colOffset - CELL_WIDTH / 2} ${rowOffset + GUTTER_SIZE} `;
      gutterD += `L ${colOffset + GUTTER_SIZE + CELL_WIDTH / 2} ${rowOffset + GUTTER_SIZE} `;
    }

    if (left) {
      gutterD += `M ${colOffset} ${rowOffset - CELL_HEIGHT / 2} `;
      gutterD += `L ${colOffset} ${rowOffset + GUTTER_SIZE + CELL_HEIGHT / 2} `;
    }
  }
}

const d = cellD + gutterD;
const path = createSvgElement("path", {
  "data-type": "line",
  stroke: "black",
  "stroke-width": "1",
  fill: "none",
  d,
});

elements.svg.append(path);
