import { createSeededNoise } from "./createSeededNoise";
import { isEven } from "./isEven";

type Args = {
  seed: string;
  matrixLength: number;
  noiseStep: number;
  shouldRemoveDeadEnd: boolean;
};

export function createSeededMatrix({
  seed,
  matrixLength,
  noiseStep,
  shouldRemoveDeadEnd,
}: Args) {
  const noise = createSeededNoise(seed);
  const matrix: Matrix = [];

  let xOffset = 0;
  let yOffset = 0;

  for (let row = 0; row < matrixLength; row++) {
    const isRowEven = isEven(row);

    xOffset = 0;
    matrix[row] = [];

    for (let col = 0; col < matrixLength; col++) {
      const isColEven = isEven(col);
      const value =
        isRowEven === isColEven ? null : noise(xOffset, yOffset) > 0;

      matrix[row].push(value);

      xOffset += noiseStep;
    }

    yOffset += noiseStep;
  }

  if (shouldRemoveDeadEnd) removeDeadEnd(matrix);

  return matrix;
}

function removeDeadEnd(matrix: Matrix) {
  let count: number;

  do {
    count = 0;

    for (let row = 0; row < matrix.length; row++) {
      const isRowEven = isEven(row);

      for (let col = 0; col < matrix.length; col++) {
        const isColEven = isEven(col);

        if (isRowEven || isColEven) continue;

        const top = matrix?.[row - 1]?.[col] ?? false;
        const right = matrix?.[row]?.[col + 1] ?? false;
        const bottom = matrix?.[row + 1]?.[col] ?? false;
        const left = matrix?.[row]?.[col - 1] ?? false;

        const amount =
          Number(top) + Number(right) + Number(bottom) + Number(left);

        if (amount !== 3) continue;

        count++;

        matrix[row - 1][col] = true;
        matrix[row][col + 1] = true;
        matrix[row + 1][col] = true;
        matrix[row][col - 1] = true;
      }
    }
  } while (count > 0);
}
