"use strict"

var SerialPort = require("serialport").SerialPort

function EnttecOpenUsbDMX(device_id, options) {
	var self = this
	options = options || {}

	this.universe = new Buffer(512)
	this.universe.fill(0)

	self.interval = 23

	this.dev = new SerialPort(device_id, {
		'baudrate': 57600,
		'databits': 8,
		'stopbits': 2,
		'parity': 'none'
	}, true, function(err) {
		if(!err) {
			self.start()
		}
	})
}

EnttecOpenUsbDMX.prototype.send_universe = function() {
	if(!this.dev.isOpen()) {
		return
	}

	this.dev.write(this.universe)

	// toggle break
	this.dev.set({brk: true}, function(err, r) {
		this.dev.set({brk: false})
	})
}

EnttecOpenUsbDMX.prototype.start = function() {
	this.intervalhandle = setInterval(this.send_universe.bind(this), this.interval)
}

EnttecOpenUsbDMX.prototype.stop = function() {
	clearInterval(this.intervalhandle)
}

EnttecOpenUsbDMX.prototype.close = function(cb) {
	this.stop()
	this.dev.close(cb)
}

EnttecOpenUsbDMX.prototype.update = function(u) {
	for(var c in u) {
		this.universe[c] = u[c]
	}
}

EnttecOpenUsbDMX.prototype.updateAll = function(v) {
	for(var i = 0; i < 512; i++) {
		this.universe[i] = v
	}
}

EnttecOpenUsbDMX.prototype.get = function(c) {
	return this.universe[c]
}

module.exports = EnttecOpenUsbDMX
