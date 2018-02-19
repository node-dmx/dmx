"use strict"

var SerialPort = require("serialport")

var UNIVERSE_LEN = 512

function DMX4ALL(device_id, options) {
	var self = this
	options = options || {}
	this.universe = new Buffer(UNIVERSE_LEN + 1)
	this.universe.fill(0)

	this.dev = new SerialPort(device_id, {
		'baudRate': 38400,
		'dataBits': 8,
		'stopBits': 1,
		'parity': 'none'
	}, function(err) {
		if(!err) {
			self.send_universe()
		}
	})
	this.dev.on('data', function(data) {
		//process.stdout.write(data.toString('ascii'))
	})
}

DMX4ALL.prototype.send_universe = function() {
	if(!this.dev.writable) {
		return
	}

	var msg = Buffer(UNIVERSE_LEN * 3)
	for(var i = 0; i < UNIVERSE_LEN; i++) {
		msg[i * 3 + 0] = (i < 256) ? 0xE2 : 0xE3
		msg[i * 3 + 1] = i
		msg[i * 3 + 2] = this.universe[i + 1]
	}
	this.dev.write(msg)
}

DMX4ALL.prototype.start = function() {}
DMX4ALL.prototype.stop = function() {}

DMX4ALL.prototype.close = function(cb) {
	this.dev.close(cb)
}

DMX4ALL.prototype.update = function(u) {
	for(var c in u) {
		this.universe[c] = u[c]
	}
	this.send_universe()
}

DMX4ALL.prototype.updateAll = function(v){
	for(var i = 1; i <= 512; i++) {
		this.universe[i] = v
	}
	this.send_universe()
}

DMX4ALL.prototype.get = function(c) {
	return this.universe[c]
}

module.exports = DMX4ALL
