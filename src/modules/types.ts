export type Bullet = {
  id: hash;
  uuid: number;
  type: string;
  pattern: string;
  pos: vmath.vector3;
  dir: vmath.vector3;
  scale: vmath.vector3;
  speed: number;
  life: number;
  dead: boolean;
};

export type World = {
  player: {
    pos: vmath.vector3;
  };
};

export type RunnerIterator = Generator<number | undefined, number | boolean | void, World>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Runner = (b: Bullet, params: any) => RunnerIterator;
