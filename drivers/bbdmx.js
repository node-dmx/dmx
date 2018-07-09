'use strict'

var dgram = require('dgram')

var UNIVERSE_LEN = 512

function BBDMX(device_id, options) {
	var self = this
	self.options = options || {}
	self.universe = new Buffer(UNIVERSE_LEN + 1)
	self.universe.fill(0)
	self.host = device_id || '127.0.0.1'
	self.port = self.options.port || 9930
	self.dev = dgram.createSocket('udp4')
	self.sleepTime = 24
	self.start()
}

BBDMX.prototype.send_universe = function() {
	var channel
	var messageBuffer = new Buffer(UNIVERSE_LEN.toString())

	for (var i = 1; i <= UNIVERSE_LEN; i++) {
		channel = new Buffer(' ' + this.universe[i])
		messageBuffer = Buffer.concat([messageBuffer, channel])
	}
	this.dev.send(messageBuffer, 0, messageBuffer.length, this.port, this.host)
}

BBDMX.prototype.start = function() {
	this.timeout = setInterval(this.send_universe.bind(this), this.sleepTime)
}

BBDMX.prototype.stop = function() {
	clearInterval(this.timeout)
}

BBDMX.prototype.close = function(cb) {
	this.stop()
	cb(null)
};

BBDMX.prototype.update = function(u) {
	for (var c in u) {
		this.universe[c] = u[c]
	}
}

BBDMX.prototype.updateAll = function(v) {
	for (var i = 1; i <= UNIVERSE_LEN; i++) {
		this.universe[i] = v
	}
}

BBDMX.prototype.get = function(c) {
	return this.universe[c]
}

module.exports = BBDMX
