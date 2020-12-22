const EventEmitter = require('events').EventEmitter;

export abstract class AbstractUniverseDriver {


  onUpdate(cb: Function): void {
    this._events.on('update', cb);
  }

  protected emitUpdate(channels: {[key:number]: number}, extraData?: any):void{
    this._events.emit('update', channels, extraData);
  }

  private readonly _events = new EventEmitter();
}
