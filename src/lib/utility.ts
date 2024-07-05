export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[]
  : T[P] extends object ? RecursivePartial<T[P]>
  : T[P];
};

export type ArrayOr<T> = T | T[];

export const toArray = <T>(value: ArrayOr<T>): T[] => {
  return Array.isArray(value) ? value : [value];
};

export const trimGoogleFontsIcon = (delta: number): string => {
  const minX = delta / 2;
  const minY = -960 + delta / 2;
  const width = 960 - delta;
  const height = 960 - delta;
  return `${minX} ${minY} ${width} ${height}`;
};
