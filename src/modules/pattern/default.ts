import { DIRECTIONAL } from '../patterns';
import type { Bullet, RunnerIterator } from '../types';

const fire = (pos: vmath.vector3, type: string, angle: number) =>
  msg.post('/bullets#runner', 'fire', { pos, type, pattern: DIRECTIONAL, params: { angle } });

function* bloom(b: Bullet): RunnerIterator {
  for (let i = 0; i < 360; i += 15) {
    fire(b.pos, b.type, i);
    yield 10;
  }
}

export default function* (b: Bullet): RunnerIterator {
  // Travel Upward for 200ms
  b.dir.y = 1;
  yield 200;

  // Hold for 400ms
  b.dir.y = 0;
  yield 400;

  // Emit Spinner
  yield* bloom(b);

  // Increase speed
  b.speed *= 4;

  // Home toward player
  while (b.dead === false) {
    const { player } = yield;
    const dir = (player.pos - b.pos) as vmath.vector3;
    const length = vmath.length(dir);
    b.dir = (dir / length) as vmath.vector3;
  }
}
