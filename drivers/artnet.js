"use strict"

const dgram = require('dgram');

const ARTNET = {
	PORT : 6454,
	HOST : "127.0.0.1"
}

function EnttecODE(device_id, cb) {
    var self = this

    self.header = new Buffer([65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14]);
    self.sequence = self.physical = new Buffer([0]);
    self.length = new Buffer([0x02,0x00]);

    cb = cb || function() {}
    this.universe = new Buffer(512)
    this.universe.fill(0)

    self.sleepTime = 24
    self.timeout

    self.dev = dgram.createSocket('udp4');
    self.start();

    // self.dev.bind(6454, function() {

    // });
}

EnttecODE.prototype.send_universe = function() {

    var pkg = Buffer.concat([this.header, this.sequence, this.physical,this.length,this.universe]);

    this.dev.send(pkg, 0, pkg.length, ARTNET.PORT, ARTNET.HOST, function() {
      	// Package Sent  
    });
}

EnttecODE.prototype.start = function() {
    this.timeout = setInterval(this.send_universe.bind(this), this.sleepTime)
}

EnttecODE.prototype.stop = function() {
    clearInterval(this.timeout)
}

EnttecODE.prototype.close = function(cb) {
    this.stop()
    this.dev.close(cb)
}

EnttecODE.prototype.update = function(u) {
    for (var c in u) {
        this.universe[c] = u[c]
    }
}

EnttecODE.prototype.updateAll = function(v) {
    for (var i = 0; i < 512; i++) {
        this.universe[i] = v
    }
}

EnttecODE.prototype.get = function(c) {
    return this.universe[c]
}

module.exports = EnttecODE
