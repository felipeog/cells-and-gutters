export const PAGE_WIDTH = 210; // mm (A4)
export const PAGE_HEIGHT = 297; // mm (A4)

export const MARGIN_X = 0.1; // fraction of page width
export const MARGIN_Y = 0.1; // fraction of page height

export const MARGIN_X_SIZE = PAGE_WIDTH * MARGIN_X;
export const MARGIN_Y_SIZE = PAGE_HEIGHT * MARGIN_Y;

export const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN_X_SIZE;
export const CONTENT_HEIGHT = PAGE_HEIGHT - 2 * MARGIN_Y_SIZE;

export const CELL_AMOUNT = 8;
export const GUTTER_AMOUNT = CELL_AMOUNT - 1;
export const GUTTER_RATIO = 0.5;

// CELL_WIDTH fills content width exactly with GUTTER_RATIO-sized gutters
export const CELL_WIDTH =
  CONTENT_WIDTH / (CELL_AMOUNT + GUTTER_AMOUNT * GUTTER_RATIO);
export const GUTTER_SIZE = CELL_WIDTH * GUTTER_RATIO;

// CELL_HEIGHT fills content height exactly with the same GUTTER_SIZE
export const CELL_HEIGHT =
  (CONTENT_HEIGHT - GUTTER_AMOUNT * GUTTER_SIZE) / CELL_AMOUNT;

export const CELL_RADIUS = Math.min(CELL_WIDTH, CELL_HEIGHT) / 2;
export const MATRIX_LENGTH = CELL_AMOUNT + GUTTER_AMOUNT;

// Aliases used by the rendering code
export const SVG_WIDTH = CONTENT_WIDTH;
export const SVG_HEIGHT = CONTENT_HEIGHT;

export const SEED = "cells-and-gutters-000";
export const NOISE_STEP = 0.3;
export const DEBUG = false;
