const util = require('util');
const EventEmitter = require('events').EventEmitter;

function SocketioDriver(deviceId, options) {
  options = options || {};

  const self = this;
  const io = require('socket.io');
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

SocketioDriver.prototype.start = function () {};

SocketioDriver.prototype.stop = function () {
  clearInterval(this.timeout);
};

SocketioDriver.prototype.close = cb => {
  cb(null);
};

SocketioDriver.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
  this.server.sockets.emit('update', [...this.universe]);
  this.emit('update', u, extraData);
};

SocketioDriver.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }

  this.server.sockets.emit('update', [...this.universe]);
};

SocketioDriver.prototype.get = function (c) {
  return this.universe[c];
};

util.inherits(SocketioDriver, EventEmitter);

module.exports = SocketioDriver;
