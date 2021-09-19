/** @noSelfInFile **/
/** @noResolution */
declare module 'metrics.mem' {
  /** @noSelf */
  export interface Metrics {
    mem: () => number;
    update: () => void;
  }

  export function create(): Metrics;
}
