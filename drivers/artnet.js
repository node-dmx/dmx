const dgram = require('dgram');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

const STATE_STOPPED = 0;
const STATE_IDLE = 1;
const STATE_QUICK_REFRESH = 2;

// See page 45: https://artisticlicence.com/WebSiteMaster/User%20Guides/art-net.pdf 
const UNIVERSE_IDLE_RETRANSMIT_INTERVAL = 800;

function ArtnetDriver(deviceId = '127.0.0.1', options = {}) {
  this.readyToWrite = true;
  this.header = Buffer.from([65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14]);
  this.sequence = Buffer.from([0]);
  this.physical = Buffer.from([0]);
  this.universeId = Buffer.from([0x00, 0x00]);
  this.length = Buffer.from([0x02, 0x00]);

  this.universe = Buffer.alloc(513);
  this.universe.fill(0);

  /**
   * Allow artnet rate to be set and default to 44Hz
   * @type Number
   */
  this.interval = !isNaN(options.dmx_speed) ? 1000 / options.dmx_speed : 24;

  this.state = STATE_STOPPED;
  this.universeUpdated = false;
  this.quickRefreshTimeout = false;
  this.transmissionIntervalTimer = null;

  this.universeId.writeInt16LE(options.universe || 0, 0);
  this.host = deviceId;
  this.port = options.port || 6454;
  this.dev = dgram.createSocket('udp4');
  this.dev.bind(() => this.dev.setBroadcast(true));
  this.start();
}

ArtnetDriver.prototype.sendUniverse = function (_) {
  const pkg = Buffer.concat([
    this.header,
    this.sequence,
    this.physical,
    this.universeId,
    this.length,
    this.universe.slice(1),
  ]);

  if (this.readyToWrite) {
    this.universeUpdated = false;
    this.readyToWrite = false;
    this.dev.send(pkg, 0, pkg.length, this.port, this.host, () => {
      this.readyToWrite = true;
    });
  }
};

ArtnetDriver.prototype.start = function () {
  this.sendUniverse();
  this.moveToState(STATE_IDLE);
};

ArtnetDriver.prototype.stop = function () {
  this.moveToState(STATE_STOPPED);
};

ArtnetDriver.prototype.close = function (cb) {
  this.stop();
  cb(null);
};

ArtnetDriver.prototype.moveToState = function (state) {
  if (state === this.state) {
    return;
  }

  this.state = state;

  // Cancel previous interval
  if (this.transmissionIntervalTimer) {
    clearInterval(this.transmissionIntervalTimer);
  }

  if (state === STATE_IDLE) {
    this.transmissionIntervalTimer = setInterval(
      this.sendUniverse.bind(this),
      UNIVERSE_IDLE_RETRANSMIT_INTERVAL
    );
  } else if (state === STATE_QUICK_REFRESH) {
    this.quickRefreshTimeout = false;
    this.sendUniverse();
    this.transmissionIntervalTimer = setInterval(
      (() => {
        // Final quick refresh has happened and universe still not updated, revert to IDLE
        if (this.quickRefreshTimeout) {
          this.moveToState(STATE_IDLE);
        } else {
          if (this.universeUpdated) {
            this.sendUniverse();
            this.quickRefreshTimeout = false;
          } else {
            this.quickRefreshTimeout = true;
          }
        }
      }).bind(this),
      this.interval
    );
  }
};

ArtnetDriver.prototype.onUpdate = function () {
  if (this.state === STATE_STOPPED) {
    return;
  }

  this.universeUpdated = true;

  if (this.state === STATE_IDLE) {
    this.moveToState(STATE_QUICK_REFRESH);
  }
};

ArtnetDriver.prototype.update = function (u, extraData) {
  for (const c in u) {
    this.universe[c] = u[c];
  }

  this.onUpdate();

  this.emit('update', u, extraData);
};

ArtnetDriver.prototype.updateAll = function (v, _) {
  for (let i = 1; i <= 512; i++) {
    this.universe[i] = v;
  }

  this.onUpdate();
};

ArtnetDriver.prototype.get = function (c) {
  return this.universe[c];
};

util.inherits(ArtnetDriver, EventEmitter);

module.exports = ArtnetDriver;
