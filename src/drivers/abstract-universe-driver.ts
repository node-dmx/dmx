const EventEmitter = require('events').EventEmitter;

export abstract class AbstractUniverseDriver {


  onUpdate(cb: Function): void {
    this._events.on('update', cb);
  }

  protected readonly _events = new EventEmitter();
}
