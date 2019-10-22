const util = require('util');
const EventEmitter = require('events').EventEmitter;

function SocketDriver(deviceId, options) {
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

SocketDriver.prototype.start = function () {};

SocketDriver.prototype.stop = function () {
  clearInterval(this.timeout);
};

SocketDriver.prototype.close = cb => {
  cb(null);
};

SocketDriver.prototype.update = function (u) {
  for (const c in u) {
    this.universe[c] = u[c];
  }
  this.server.sockets.emit('update', [...this.universe]);
  this.emit('update', u);
};

SocketDriver.prototype.updateAll = function (v) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }

  this.server.sockets.emit('update', [...this.universe]);
};

SocketDriver.prototype.get = function (c) {
  return this.universe[c];
};

util.inherits(SocketDriver, EventEmitter);

module.exports = SocketDriver;
