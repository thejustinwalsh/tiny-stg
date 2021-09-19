import { DEFAULT } from '../modules/patterns';

interface Props {
  player: string;
  type: hash;
  input: vmath.vector3;
  dir: vmath.vector3;
  speed: number;
  moving: boolean;
  firing: boolean;
  anim: string;
  bounds: vmath.vector3;
  bulletRank: number;
  bulletType: hash;
  bulletOffset: vmath.vector3;
  fireTimer: number;
  fireDelay: number;
  repeatDelay: number;
}

go.property('speed', 10);
go.property('type', hash('player-blue'));
go.property('bounds', vmath.vector3(160, 183, 0));
go.property('fireDelay', 0.33);
go.property('repeatDelay', 0.1);

const fire = (pos: vmath.vector3) =>
  msg.post('/bullets#runner', 'fire', { pos, type: 'player', pattern: DEFAULT, speed: 200 });

export function init(this: Props): void {
  msg.post('.', 'acquire_input_focus');

  this.input = vmath.vector3();
  this.dir = vmath.vector3(0, 1, 0);
  this.bulletOffset = vmath.vector3(0, 16, 0);

  this.player = 'player-blue';
  if (this.type == hash('player-blue')) this.player = 'player-blue';
  if (this.type == hash('player-red')) this.player = 'player-red';
  if (this.type == hash('player-yellow')) this.player = 'player-yellow';
  if (this.type == hash('player-green')) this.player = 'player-green';

  this.bulletRank = 0;
  this.bulletType = hash('standard');

  this.fireTimer = 0;
}

export function final(): void {
  msg.post('.', 'release_input_focus');
}

export function update(this: Props, dt: number): void {
  if (this.moving) {
    let pos = go.get_position();
    pos = (pos + this.dir * this.speed * dt) as vmath.vector3;
    pos.x = math.min(math.max(pos.x, -this.bounds.x), this.bounds.x);
    pos.y = math.min(math.max(pos.y, 0), this.bounds.y);
    go.set_position(pos);

    const anim = this.dir.x < 0 ? 'left' : this.dir.x > 0 ? 'right' : 'idle';
    if (this.anim != anim) {
      //msg.post('#player-ship', 'play_animation', { id: hash(`${this.player}-${anim}`) });
      //msg.post('#player-shadow', 'play_animation', { id: hash(`player-shadow-${anim}`) });
      this.anim = anim;
    }
  } else if (this.anim != 'idle') {
    //msg.post('#player-ship', 'play_animation', { id: hash(`${this.player}-idle`) });
    //msg.post('#player-shadow', 'play_animation', { id: hash(`player-shadow-idle`) });
    this.anim = 'idle';
  }

  if (this.firing) {
    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      this.fireTimer += this.repeatDelay;
      fire((go.get_position() + this.bulletOffset) as vmath.vector3);
    }
  }

  this.input.x = 0;
  this.input.y = 0;
  this.moving = false;
}

interface InputAction {
  pressed: boolean;
  released: boolean;
}

export function on_input(this: Props, actionId: hash, action: InputAction): void {
  switch (actionId) {
    case hash('forward'):
      this.input.y = 1;
      break;
    case hash('backward'):
      this.input.y = -1;
      break;
    case hash('left'):
      this.input.x = -1;
      break;
    case hash('right'):
      this.input.x = 1;
      break;
    case hash('fire'):
      {
        if (action.pressed) {
          this.firing = true;
          this.fireTimer = this.fireDelay;
          //fire(go.get_position(), this.bulletRank, this.bulletType);
        } else if (action.released) {
          this.firing = false;
        }
      }
      break;
  }

  if (vmath.length(this.input) > 0) {
    this.moving = true;
    this.dir = vmath.normalize(this.input);
  }
}

export function on_message(this: Props, messageId: hash, message: unknown, _sender: url): void {
  switch (messageId) {
    case hash('rank'):
      {
        const msgRank = message as { rank: string; type: string };
        this.bulletRank = ['0', '1', '2'].indexOf(msgRank.rank);
      }
      break;
    case hash('type'):
      {
        const msgRank = message as { rank: string; type: string };
        this.bulletType = hash(msgRank.type);
      }
      break;
  }
}
