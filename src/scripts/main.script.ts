import * as lldebugger from 'lldebugger.debug';
lldebugger.start();

interface props {
  doOnce: boolean;
}

export function init(this: props): void {
  // init
}

export function update(this: props, _dt: number): void {
  // update
}

export function on_message(this: props, _message_id: hash, _message: string, _sender: url): void {
  // on message
}
