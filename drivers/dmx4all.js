"use strict"

var SerialPort = require("serialport")

function DMX4ALL(device_id, options) {
	var self = this
	options = options || {}
	this.universe = new Buffer(512)
	this.universe.fill(0)

	this.dev = new SerialPort(device_id, {
		'baudrate': 38400,
		'databits': 8,
		'stopbits': 1,
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
	if(!this.dev.isOpen()) {
		return
	}

	var msg = Buffer(this.universe.length * 3)
	for(var i = 0; i < this.universe.length; i++) {
		msg[i * 3 + 0] = (i < 256) ? 0xE2 : 0xE3
		msg[i * 3 + 1] = i
		msg[i * 3 + 2] = this.universe[i]
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
	for(var i = 0; i < 512; i++) {
		this.universe[i] = v
	}
	this.send_universe()
}

DMX4ALL.prototype.get = function(c) {
	return this.universe[c]
}

module.exports = DMX4ALL