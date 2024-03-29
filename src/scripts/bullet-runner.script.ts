import type { Bullet, World, RunnerIterator } from '../modules/types';
import patterns from '../modules/runners';

interface Props {
  bullets: Array<Bullet>;
  delay: Array<number>;
  runners: Map<number, RunnerIterator>;
  types: Record<string, url>;
  nextId: number;
}

type FireMessageProps = {
  pos: vmath.vector3;
  type: 'player | enemy';
  pattern: string;
  params: unknown;
};

export function init(this: Props): void {
  this.nextId = 0;
  this.bullets = [];
  this.delay = [];
  this.runners = new Map<number, RunnerIterator>();
  this.types = {
    player: '#player',
    enemy: '#enemy',
  };
}

export function update(this: Props, dt: number): void {
  const start = socket.gettime();
  const SCALE = 4; // TODO: get scale from camera
  const [width, height] = window.get_size();
  const sWidth = width / SCALE;
  const sHeight = height / SCALE;
  const world: World = {
    player: {
      pos: vmath.vector3(0, height / 2, 0),
    },
  };

  for (let i = 0; i < this.bullets.length; i++) {
    const bullet = this.bullets[i];
    const delay = this.delay[i] === math.huge ? 1 : (this.delay[i] = this.delay[i] - dt * 1000);

    // Update bullet runner
    let destroy = false;
    if (this.runners.has(bullet.uuid) && delay <= 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const result = this.runners.get(bullet.uuid)!.next(world);
      if (result.done === true && result.value === true) destroy = true;
      this.delay[i] = result.value === true ? math.huge : ((result.value ?? 0) as number);
    }
    bullet.life += dt;

    bullet.pos = (bullet.pos + bullet.dir * bullet.speed * dt) as vmath.vector3;
    go.set_position(bullet.pos, bullet.id);

    const PADDING = 25;
    const MAX_LIFE = 30;
    destroy =
      destroy ||
      bullet.pos.y > sHeight + PADDING ||
      bullet.pos.y < -PADDING ||
      bullet.pos.x > sWidth / 2 + PADDING ||
      bullet.pos.x < -(sWidth / 2 + PADDING);
    if (destroy || bullet.life > MAX_LIFE) {
      const dead = this.bullets[i];

      this.bullets[i] = this.bullets[this.bullets.length - 1];
      this.delay[i] = this.delay[this.delay.length - 1];
      this.bullets.pop();
      this.delay.pop();

      dead.dead = true;
      // Exhaust runner (needed if we recycle coroutines)
      //const deadRunner = this.runners.get(dead.uuid);
      //if (deadRunner) while (deadRunner.next(world)?.done !== true);
      this.runners.delete(dead.uuid);
      go.delete(dead.id);
    }
  }

  msg.post('/gui#debug', 'bullets', { bullets: this.bullets.length, run: (socket.gettime() - start) * 1000 });
}

export function on_message(this: Props, message_id: hash, message: unknown, _sender: url): void {
  if (message_id == hash('fire')) {
    const { pos, type, pattern, params } = message as FireMessageProps;

    // Assign a unique id to the bullet
    const uuid = this.nextId;
    this.nextId += 0.0000001 % 1;

    // Offset the z with uuid
    pos.z = uuid;

    // Create the bullet
    const bullet = {
      id: factory.create(this.types[type], pos),
      uuid,
      type,
      pattern,
      pos,
      speed: 100,
      dir: vmath.vector3(0, 1, 0),
      scale: vmath.vector3(1, 1, 1),
      life: 0,
      dead: false,
    };

    this.bullets.push(bullet);
    this.delay.push(0);
    this.runners.set(bullet.uuid, patterns[bullet.pattern](bullet, params));
  }
}
