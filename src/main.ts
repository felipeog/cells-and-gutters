import './style.css'
import {
  CELL_SIZE,
  CELL_RADIUS,
  GUTTER_SIZE,
  MATRIX_LENGTH,
  SVG_SIZE,
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
      const offset = index * CELL_SIZE + index * GUTTER_SIZE;

      gridD += `M ${0 - GUTTER_SIZE} ${offset} L ${SVG_SIZE + GUTTER_SIZE} ${offset} `;
      gridD += `M ${offset} ${0 - GUTTER_SIZE} L ${offset} ${SVG_SIZE + GUTTER_SIZE} `;
    } else {
      const index = Math.floor(i / 2);
      const offset = index * CELL_SIZE + (index - 1) * GUTTER_SIZE;

      gridD += `M ${0 - GUTTER_SIZE} ${offset} L ${SVG_SIZE + GUTTER_SIZE} ${offset} `;
      gridD += `M ${offset} ${0 - GUTTER_SIZE} L ${offset} ${SVG_SIZE + GUTTER_SIZE} `;
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

        const rowOffset = rowIndex * CELL_SIZE + rowIndex * GUTTER_SIZE;
        const colOffset =
          colIndex * CELL_SIZE + colIndex * GUTTER_SIZE + CELL_SIZE;

        const text = createSvgElement("text", {
          "data-row": String(row),
          "data-col": String(col),
          x: String(colOffset + GUTTER_SIZE / 2),
          y: String(rowOffset + CELL_SIZE / 2),
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
          rowIndex * CELL_SIZE + rowIndex * GUTTER_SIZE + CELL_SIZE;
        const colOffset = colIndex * CELL_SIZE + colIndex * GUTTER_SIZE;

        const text = createSvgElement("text", {
          "data-row": String(row),
          "data-col": String(col),
          x: String(colOffset + CELL_SIZE / 2),
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
    const rowOffset = rowIndex * CELL_SIZE + rowIndex * GUTTER_SIZE;
    const colOffset = colIndex * CELL_SIZE + colIndex * GUTTER_SIZE;

    // TODO: move debugging
    if (DEBUG) {
      const cellCircle = createSvgElement("circle", {
        "data-type": "gutter",
        "data-row": String(row),
        "data-col": String(col),
        "data-top": String(top),
        "data-right": String(right),
        "data-bottom": String(bottom),
        "data-left": String(left),
        cx: String(colOffset + CELL_SIZE / 2),
        cy: String(rowOffset + CELL_SIZE / 2),
        r: "2",
        stroke: "none",
        fill: "rgb(255 0 0 / 0.2)",
      });

      elements.svg.append(cellCircle);
    }

    let d = "";

    if (!top && !right) {
      d += `M ${colOffset + CELL_RADIUS} ${rowOffset} `;
      d += `A ${CELL_RADIUS} ${CELL_RADIUS} 0 0 1 ${colOffset + CELL_SIZE} ${rowOffset + CELL_RADIUS} `;
    }

    if (!right && !bottom) {
      d += `M ${colOffset + CELL_SIZE} ${rowOffset + CELL_RADIUS} `;
      d += `A ${CELL_RADIUS} ${CELL_RADIUS} 0 0 1 ${colOffset + CELL_RADIUS} ${rowOffset + CELL_SIZE} `;
    }

    if (!bottom && !left) {
      d += `M ${colOffset + CELL_RADIUS} ${rowOffset + CELL_SIZE} `;
      d += `A ${CELL_RADIUS} ${CELL_RADIUS} 0 0 1 ${colOffset} ${rowOffset + CELL_RADIUS} `;
    }

    if (!left && !top) {
      d += `M ${colOffset} ${rowOffset + CELL_RADIUS} `;
      d += `A ${CELL_RADIUS} ${CELL_RADIUS} 0 0 1 ${colOffset + CELL_RADIUS} ${rowOffset} `;
    }

    const path = createSvgElement("path", {
      "data-type": "cell",
      "data-row": String(row),
      "data-col": String(col),
      stroke: "black",
      "stroke-width": "1",
      fill: "none",
      d,
    });

    elements.svg.append(path);
  }
}

// TODO: move gutters rendering
const gutterStart = cellStart - 1;
const gutterEnd = cellEnd + 1;

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
    const rowOffset = rowIndex * CELL_SIZE + (rowIndex - 1) * GUTTER_SIZE;
    const colOffset = colIndex * CELL_SIZE + (colIndex - 1) * GUTTER_SIZE;

    // TODO: move debugging
    if (DEBUG) {
      const gutterCircle = createSvgElement("circle", {
        "data-type": "gutter",
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

    let d = "";

    if (amount === 3) {
      const r = GUTTER_SIZE / 2;

      if (!top) {
        d += `M ${colOffset + GUTTER_SIZE} ${rowOffset - CELL_SIZE / 2} `;
        d += `A ${r} ${r} 0 0 1 ${colOffset} ${rowOffset - CELL_SIZE / 2} `;
      }

      if (!right) {
        d += `M ${colOffset + GUTTER_SIZE + CELL_SIZE / 2} ${rowOffset + GUTTER_SIZE} `;
        d += `A ${r} ${r} 0 0 1 ${colOffset + GUTTER_SIZE + CELL_SIZE / 2} ${rowOffset} `;
      }

      if (!bottom) {
        d += `M ${colOffset} ${rowOffset + GUTTER_SIZE + CELL_SIZE / 2} `;
        d += `A ${r} ${r} 0 0 1 ${colOffset + GUTTER_SIZE} ${rowOffset + GUTTER_SIZE + CELL_SIZE / 2} `;
      }

      if (!left) {
        d += `M ${colOffset - CELL_SIZE / 2} ${rowOffset} `;
        d += `A ${r} ${r} 0 0 1 ${colOffset - CELL_SIZE / 2} ${rowOffset + GUTTER_SIZE} `;
      }

      const path = createSvgElement("path", {
        "data-type": "gutter",
        "data-row": String(row),
        "data-col": String(col),
        stroke: "black",
        "stroke-width": "1",
        fill: "none",
        d,
      });

      elements.svg.append(path);

      continue;
    }

    const isCurve =
      (top && right) || (right && bottom) || (bottom && left) || (left && top);

    if (amount === 2 && isCurve) {
      const r = (CELL_SIZE + 2 * GUTTER_SIZE) / 2;

      if (top && right) {
        d += `M ${colOffset - CELL_SIZE / 2} ${rowOffset} `;
        d += `A ${r} ${r} 0 0 1 ${colOffset + GUTTER_SIZE} ${rowOffset + GUTTER_SIZE + CELL_SIZE / 2} `;
      }

      if (right && bottom) {
        d += `M ${colOffset + GUTTER_SIZE} ${rowOffset - CELL_SIZE / 2} `;
        d += `A ${r} ${r} 0 0 1 ${colOffset + -CELL_SIZE / 2} ${rowOffset + GUTTER_SIZE} `;
      }

      if (bottom && left) {
        d += `M ${colOffset + GUTTER_SIZE + CELL_SIZE / 2} ${rowOffset + GUTTER_SIZE} `;
        d += `A ${r} ${r} 0 0 1 ${colOffset} ${rowOffset - CELL_SIZE / 2} `;
      }

      if (left && top) {
        d += `M ${colOffset} ${rowOffset + GUTTER_SIZE + CELL_SIZE / 2} `;
        d += `A ${r} ${r} 0 0 1 ${colOffset + GUTTER_SIZE + CELL_SIZE / 2} ${rowOffset} `;
      }

      const path = createSvgElement("path", {
        "data-type": "gutter",
        "data-row": String(row),
        "data-col": String(col),
        stroke: "black",
        "stroke-width": "1",
        fill: "none",
        d,
      });

      elements.svg.append(path);

      continue;
    }

    if (top) {
      d += `M ${colOffset - CELL_SIZE / 2} ${rowOffset} `;
      d += `L ${colOffset + GUTTER_SIZE + CELL_SIZE / 2} ${rowOffset} `;
    }

    if (right) {
      d += `M ${colOffset + GUTTER_SIZE} ${rowOffset - CELL_SIZE / 2} `;
      d += `L ${colOffset + GUTTER_SIZE} ${rowOffset + GUTTER_SIZE + CELL_SIZE / 2} `;
    }

    if (bottom) {
      d += `M ${colOffset - CELL_SIZE / 2} ${rowOffset + GUTTER_SIZE} `;
      d += `L ${colOffset + GUTTER_SIZE + CELL_SIZE / 2} ${rowOffset + GUTTER_SIZE} `;
    }

    if (left) {
      d += `M ${colOffset} ${rowOffset - CELL_SIZE / 2} `;
      d += `L ${colOffset} ${rowOffset + GUTTER_SIZE + CELL_SIZE / 2} `;
    }

    const path = createSvgElement("path", {
      "data-type": "gutter",
      "data-row": String(row),
      "data-col": String(col),
      stroke: "black",
      "stroke-width": "1",
      fill: "none",
      d,
    });

    elements.svg.append(path);
  }
}
