import type { Bullet, RunnerIterator } from '../types';

type Params = {
  angle: number;
};

export default function* (b: Bullet, params: Params): RunnerIterator {
  b.dir = vmath.rotate(vmath.quat_rotation_z(math.rad(params.angle)), vmath.vector3(0, 1, 0));

  yield;
}
