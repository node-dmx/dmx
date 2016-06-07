"use strict"

var dgram = require('dgram')

function EnttecODE(device_id, options) {
	var self = this

	self.header = new Buffer([65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14])
	self.sequence    = new Buffer([0])
	self.physical    = new Buffer([0])
	self.universe_id = new Buffer([0x00, 0x00])
	self.length      = new Buffer([0x02, 0x00])

	self.universe = new Buffer(512)
	self.universe.fill(0)

	self.sleepTime = 24

	options = options || {}
	self.universe_id.writeInt16BE(options.universe || 0, 0)
	self.host = device_id || '127.0.0.1'
	self.port = options.port || 6454
	self.dev = dgram.createSocket('udp4')
	self.start()
}

EnttecODE.prototype.send_universe = function() {
	var pkg = Buffer.concat([
		this.header,
		this.sequence,
		this.physical,
		this.universe_id,
		this.length,
		this.universe
	])

	this.dev.send(pkg, 0, pkg.length, this.port, this.host)
}

EnttecODE.prototype.start = function() {
	this.timeout = setInterval(this.send_universe.bind(this), this.sleepTime)
}

EnttecODE.prototype.stop = function() {
	clearInterval(this.timeout)
}

EnttecODE.prototype.close = function(cb) {
	this.stop()
	cb(null)
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
