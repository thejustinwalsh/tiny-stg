/** @noSelfInFile **/
/** @noResolution */
declare module 'metrics.fps' {
  /** @noSelf */
  export interface Metrics {
    fps: () => number;
    update: () => void;
  }

  export function create(): Metrics;
}
