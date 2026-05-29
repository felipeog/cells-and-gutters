import Alea from "alea";
import * as SimplexNoise from "simplex-noise";

export function createSeededNoise(seed: string) {
  const prng = Alea(seed);
  const noise2D = SimplexNoise.createNoise2D(prng);

  return noise2D;
}
