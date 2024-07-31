export type Path = (string | number)[];

export interface MetaData {
  _activePath: Path;
  _completedPaths: Path[];
}

export interface StreamingSchema {
  [key: string]: any;
  _meta: MetaData;
}

export interface TimelineItemMetadata {
  index: number;
  isCompleted: boolean;
  isActive: boolean;
}

export function isPathCompletedOrActive(
  path: Path,
  meta: MetaData
): { isCompleted: boolean; isActive: boolean } {
  const isCompleted = meta._completedPaths.some((completedPath) =>
    path.every((value, index) => completedPath[index] === value)
  );
  const isActive = meta._activePath.every(
    (value, index) => path[index] === value
  );
  return { isCompleted, isActive };
}

export function getCompletedPathsForItem(
  basePath: Path,
  meta: MetaData
): Path[] {
  return meta._completedPaths
    .filter(
      (path) =>
        path.length > basePath.length &&
        basePath.every((value, index) => path[index] === value)
    )
    .map((path) => path.slice(basePath.length));
}
