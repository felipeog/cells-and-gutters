export function roundCoords(d: string) {
  return d.replace(/-?\d+\.\d+/g, (n) =>
    String(Math.round(Number(n) * 100) / 100),
  );
}
