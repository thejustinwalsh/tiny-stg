import * as fps from 'metrics.fps';
import * as mem from 'metrics.mem';

type Props = {
  metrics: {
    fps: fps.Metrics;
    mem: mem.Metrics;
    bul: number;
    run: number;
  };
  fpsNode: node;
  memNode: node;
  bulNode: node;
  runNode: node;
};

const fps_format = 'FPS %.2f';
const mem_format = 'MEM %dkb';
const run_format = 'RUN %dms';
const bul_format = 'BUL %d';
const bad = vmath.vector4(1, 0, 0, 1);
const good = vmath.vector4(0, 1, 0, 1);

export function init(this: Props): void {
  this.metrics = {
    fps: fps.create(),
    mem: mem.create(),
    bul: 0,
    run: 0,
  };

  this.fpsNode = gui.get_node('fps');
  this.memNode = gui.get_node('mem');
  this.bulNode = gui.get_node('bul');
  this.runNode = gui.get_node('run');
}

export function update(this: Props, _dt: number): void {
  this.metrics.fps.update();
  this.metrics.mem.update();

  const fps = this.metrics.fps.fps();
  gui.set_text(this.fpsNode, string.format(fps_format, fps));
  gui.set_color(this.fpsNode, vmath.lerp(math.max(0, math.min(60, fps)) / 60, bad, good));

  const mem = this.metrics.mem.mem();
  gui.set_text(this.memNode, string.format(mem_format, mem));
  gui.set_color(this.memNode, vmath.lerp(math.max(0, math.min(10000, mem)) / 10000, good, bad));

  const run = this.metrics.run;
  gui.set_text(this.runNode, string.format(run_format, run));
  //gui.set_color(this.memNode, vmath.lerp(math.max(0, math.min(16, run)) / 16, good, bad));

  const bul = this.metrics.bul;
  gui.set_text(this.bulNode, string.format(bul_format, bul));
  //gui.set_color(this.memNode, vmath.lerp(math.max(0, math.min(10000, mem)) / 10000, good, bad));
}

export function on_message(this: Props, message_id: hash, message: unknown, _sender: url): void {
  if (message_id === hash('bullets')) {
    const { bullets, run } = message as { bullets: number; run: number };
    this.metrics.bul = bullets;
    this.metrics.run = run;
  }
}
