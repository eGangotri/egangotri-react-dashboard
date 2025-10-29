export type ColorTriple = { bg: string; color: string; border: string };

export const colorForKey = (key: string): ColorTriple => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);
  const hue = (abs * 137.508) % 360;
  const sat = 65 + (abs % 25);
  const light = 78 + ((abs >> 7) % 14);
  const bg = `hsl(${hue.toFixed(2)}, ${sat}%, ${light}%)`;
  const color = `hsl(${hue.toFixed(2)}, 60%, 20%)`;
  const border = `hsl(${hue.toFixed(2)}, 70%, 35%)`;
  return { bg, color, border };
};

export const buildDeterministicColorMap = (ids: string[]): Record<string, ColorTriple> => {
  const map: Record<string, ColorTriple> = {};
  ids.forEach((id, idx) => {
    const hue = (idx * 137.508) % 360;
    const sat = 70;
    const light = 85 - (idx % 3) * 5;
    const bg = `hsl(${hue.toFixed(2)}, ${sat}%, ${light}%)`;
    const color = `hsl(${hue.toFixed(2)}, 60%, 20%)`;
    const border = `hsl(${hue.toFixed(2)}, 70%, 35%)`;
    map[id] = { bg, color, border };
  });
  return map;
};
