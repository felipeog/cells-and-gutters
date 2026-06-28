interface Point {
  x: number;
  y: number;
}

type Command =
  | { type: "L"; from: Point; to: Point }
  | {
      type: "A";
      from: Point;
      to: Point;
      rx: number;
      ry: number;
      xRot: number;
      largeArc: number;
      sweep: number;
    };

interface Stroke {
  commands: Command[];
}

function pk(p: Point): string {
  return `${p.x},${p.y}`;
}

function strokeStart(s: Stroke): Point {
  return s.commands[0].from;
}

function strokeEnd(s: Stroke): Point {
  return s.commands[s.commands.length - 1].to;
}

function dist2(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function parseStrokes(d: string): Stroke[] {
  const tokens = d.match(/[MLA][^MLA]*/g) ?? [];
  const strokes: Stroke[] = [];

  let current: Stroke | null = null;
  let pos: Point = { x: 0, y: 0 };

  for (const token of tokens) {
    const cmd = token[0];
    const nums = token.slice(1).trim().split(/\s+/).filter(Boolean).map(Number);

    if (cmd === "M") {
      if (current?.commands.length) strokes.push(current);

      pos = { x: nums[0], y: nums[1] };
      current = { commands: [] };
    } else if (cmd === "L" && current) {
      const from = { ...pos };

      pos = { x: nums[0], y: nums[1] };
      current.commands.push({ type: "L", from, to: { ...pos } });
    } else if (cmd === "A" && current) {
      const [rx, ry, xRot, largeArc, sweep, x, y] = nums;
      const from = { ...pos };

      pos = { x, y };
      current.commands.push({
        type: "A",
        from,
        to: { ...pos },
        rx,
        ry,
        xRot,
        largeArc,
        sweep,
      });
    }
  }

  if (current?.commands.length) strokes.push(current);

  return strokes;
}

function emitCommand(cmd: Command, reversed: boolean): string {
  const target = reversed ? cmd.from : cmd.to;

  if (cmd.type === "L") {
    return `L ${target.x} ${target.y} `;
  }

  const sweep = reversed ? 1 - cmd.sweep : cmd.sweep;

  return `A ${cmd.rx} ${cmd.ry} ${cmd.xRot} ${cmd.largeArc} ${sweep} ${target.x} ${target.y} `;
}

export function optimizePath(d: string): string {
  const strokes = parseStrokes(d);

  if (!strokes.length) return "";

  // Build adjacency: endpoint key → list of {strokeIndex, atStart}
  const adj = new Map<string, Array<{ index: number; atStart: boolean }>>();

  for (let i = 0; i < strokes.length; i++) {
    const sk = pk(strokeStart(strokes[i]));
    const ek = pk(strokeEnd(strokes[i]));

    if (!adj.has(sk)) adj.set(sk, []);
    if (!adj.has(ek)) adj.set(ek, []);

    adj.get(sk)!.push({ index: i, atStart: true });
    adj.get(ek)!.push({ index: i, atStart: false });
  }

  const used = new Array<boolean>(strokes.length).fill(false);
  let result = "";
  let pos: Point | null = null;
  let remaining = strokes.length;

  while (remaining > 0) {
    let foundIndex = -1;
    let reversed = false;

    // Extend the current chain if any stroke's endpoint matches current position exactly
    if (pos) {
      const neighbors: Array<{ index: number; atStart: boolean }> =
        adj.get(pk(pos)) ?? [];

      for (const { index, atStart } of neighbors) {
        if (!used[index]) {
          foundIndex = index;
          reversed = !atStart;
          break;
        }
      }
    }

    // No exact match — jump to the nearest unused stroke endpoint to minimise travel
    if (foundIndex === -1) {
      let minDist = Infinity;

      for (let i = 0; i < strokes.length; i++) {
        if (used[i]) continue;

        if (!pos) {
          foundIndex = i;
          break;
        }

        const ds = dist2(pos, strokeStart(strokes[i]));
        const de = dist2(pos, strokeEnd(strokes[i]));

        if (ds < minDist) {
          minDist = ds;
          foundIndex = i;
          reversed = false;
        }

        if (de < minDist) {
          minDist = de;
          foundIndex = i;
          reversed = true;
        }
      }
    }

    used[foundIndex] = true;
    remaining--;

    const stroke = strokes[foundIndex];
    const start = reversed ? strokeEnd(stroke) : strokeStart(stroke);
    const end: Point = reversed ? strokeStart(stroke) : strokeEnd(stroke);

    if (!pos || pos.x !== start.x || pos.y !== start.y) {
      result += `M ${start.x} ${start.y} `;
    }

    const cmds = reversed ? [...stroke.commands].reverse() : stroke.commands;

    for (const cmd of cmds) result += emitCommand(cmd, reversed);

    pos = end;
  }

  return result.trim();
}
