import io from 'socket.io-client';
import { EventEmitter } from 'events';

export default class SocketIODriver extends EventEmitter {
  constructor(deviceId, options) {
    super();
    options = options || {};

    const self = this;
    const port = options.port || 18909;
    const debug = options.debug || false;

    this.server = io.listen(port);
    this.server.on('connection', (socket) => {
      if (debug) console.info(`Client connected [id=${socket.id}]`);
      socket.on('disconnect', () => {
        if (debug) console.info(`Client gone [id=${socket.id}]`);
      });
    });

    this.universe = Buffer.alloc(513, 0);
    self.start();
  }

  start() {}

  stop() {
    clearInterval(this.timeout);
  }

  close(cb) {
    cb(null);
  }

  update(u, extraData) {
    for (const c in u) {
      this.universe[c] = u[c];
    }
    this.server.sockets.emit('update', [...this.universe]);
    this.emit('update', u, extraData);
  }

  updateAll(v) {
    for (let i = 1; i <= 512; i++) {
      this.universe[i] = v;
    }

    this.server.sockets.emit('update', [...this.universe]);
  }

  get(c) {
    return this.universe[c];
  }
}
