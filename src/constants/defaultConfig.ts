export const CELL_AMOUNT = 8;
export const CELL_WIDTH = 32;
export const CELL_HEIGHT = 64;
export const CELL_RADIUS = Math.min(CELL_WIDTH, CELL_HEIGHT) / 2;
export const GUTTER_AMOUNT = CELL_AMOUNT - 1;
export const GUTTER_SIZE = Math.min(CELL_WIDTH, CELL_HEIGHT) * (1 / 2);
export const MATRIX_LENGTH = CELL_AMOUNT + GUTTER_AMOUNT;
export const SVG_WIDTH = CELL_AMOUNT * CELL_WIDTH + GUTTER_AMOUNT * GUTTER_SIZE;
export const SVG_HEIGHT =
  CELL_AMOUNT * CELL_HEIGHT + GUTTER_AMOUNT * GUTTER_SIZE;
export const SEED = "cells-and-gutters-000";
export const NOISE_STEP = 0.3;
export const DEBUG = true;
export const DEBUG_MARGIN_X = CELL_WIDTH + GUTTER_SIZE;
export const DEBUG_MARGIN_Y = CELL_HEIGHT + GUTTER_SIZE;
