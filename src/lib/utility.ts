export const toArray = <T>(value: T | T[]): T[] => {
  return Array.isArray(value) ? value : [value];
};

export const trimGoogleFontsIcon = (delta: number): string => {
  const minX = delta / 2;
  const minY = -960 + delta / 2;
  const width = 960 - delta;
  const height = 960 - delta;
  return `${minX} ${minY} ${width} ${height}`;
};
