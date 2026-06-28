export const PAGE_WIDTH = 210; // mm (A4)
export const PAGE_HEIGHT = 297; // mm (A4)

export const MARGIN_X = 0.1; // fraction of page width
export const MARGIN_Y = 0.1; // fraction of page height

export const MARGIN_X_SIZE = PAGE_WIDTH * MARGIN_X;
export const MARGIN_Y_SIZE = PAGE_HEIGHT * MARGIN_Y;

export const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN_X_SIZE;
export const CONTENT_HEIGHT = PAGE_HEIGHT - 2 * MARGIN_Y_SIZE;

export const CELL_AMOUNT_X = 16; // columns
export const CELL_AMOUNT_Y = 32; // rows
export const GUTTER_AMOUNT_X = CELL_AMOUNT_X - 1;
export const GUTTER_AMOUNT_Y = CELL_AMOUNT_Y - 1;
export const GUTTER_RATIO = 0.5;

// CELL_WIDTH fills content width exactly with GUTTER_RATIO-sized gutters
export const CELL_WIDTH =
  CONTENT_WIDTH / (CELL_AMOUNT_X + GUTTER_AMOUNT_X * GUTTER_RATIO);
export const GUTTER_SIZE = CELL_WIDTH * GUTTER_RATIO;

// CELL_HEIGHT fills content height exactly with the same GUTTER_SIZE
export const CELL_HEIGHT =
  (CONTENT_HEIGHT - GUTTER_AMOUNT_Y * GUTTER_SIZE) / CELL_AMOUNT_Y;

export const CELL_RADIUS = Math.min(CELL_WIDTH, CELL_HEIGHT) / 2;
export const MATRIX_LENGTH_X = CELL_AMOUNT_X + GUTTER_AMOUNT_X;
export const MATRIX_LENGTH_Y = CELL_AMOUNT_Y + GUTTER_AMOUNT_Y;

// Aliases used by the rendering code
export const SVG_WIDTH = CONTENT_WIDTH;
export const SVG_HEIGHT = CONTENT_HEIGHT;

export const SEED = "cells-and-gutters-000";
export const NOISE_STEP = 0.3;
export const DEBUG = false;
