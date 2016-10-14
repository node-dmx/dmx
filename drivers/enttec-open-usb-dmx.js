"use strict"

var SerialPort = require("serialport")

function EnttecOpenUsbDMX(device_id, options) {
	var self = this
	options = options || {}

	this.universe = new Buffer(512)
	this.universe.fill(0)

	self.interval = 46

	this.dev = new SerialPort(device_id, {
		'baudrate': 250000,
		'databits': 8,
		'stopbits': 2,
		'parity': 'none'
	}, function(err) {
		if(err) {
			console.log(err)
			return
		}
		self.start()
	})
}

EnttecOpenUsbDMX.prototype.send_universe = function() {
	var self = this
	if(!this.dev.isOpen()) {
		return
	}

	// toggle break
	self.dev.set({brk: true}, function(err, r) {
		setTimeout(function() {
			self.dev.set({brk: false}, function(err, r) {
				setTimeout(function() {
					self.dev.write(Buffer.concat([Buffer([0]), self.universe]))
				}, 1)
			})
		}, 1)
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
