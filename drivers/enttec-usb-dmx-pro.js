"use strict"

var SerialPort = require("serialport")

var	  ENTTEC_PRO_DMX_STARTCODE = 0x00
	, ENTTEC_PRO_START_OF_MSG  = 0x7e
	, ENTTEC_PRO_END_OF_MSG    = 0xe7
	, ENTTEC_PRO_SEND_DMX_RQ   = 0x06
	, ENTTEC_PRO_RECV_DMX_PKT  = 0x05
	;

function EnttecUSBDMXPRO(device_id, options) {
	var self = this
	options = options || {}
	this.universe = new Buffer(513)
	this.universe.fill(0)

	this.dev = new SerialPort(device_id, {
		'baudRate': 250000,
		'dataBits': 8,
		'stopBits': 2,
		'parity': 'none'
	}, function(err) {
		if(!err) {
			self.send_universe()
		}
	})
}

EnttecUSBDMXPRO.prototype.send_universe = function() {
	if(!this.dev.writable) {
		return
	}
	var hdr = Buffer([
		ENTTEC_PRO_START_OF_MSG,
		ENTTEC_PRO_SEND_DMX_RQ,
		 (this.universe.length)       & 0xff,
		((this.universe.length) >> 8) & 0xff,
		ENTTEC_PRO_DMX_STARTCODE
	])

	var msg = Buffer.concat([
		hdr,
		this.universe.slice(1),
		Buffer([ENTTEC_PRO_END_OF_MSG])
	])
	this.dev.write(msg)
}

EnttecUSBDMXPRO.prototype.start = function() {}
EnttecUSBDMXPRO.prototype.stop = function() {}

EnttecUSBDMXPRO.prototype.close = function(cb) {
	this.dev.close(cb)
}

EnttecUSBDMXPRO.prototype.update = function(u) {
	for(var c in u) {
		this.universe[c] = u[c]
	}
	this.send_universe()
}

EnttecUSBDMXPRO.prototype.updateAll = function(v){
	for(var i = 1; i <= 512; i++) {
		this.universe[i] = v
	}
	this.send_universe()
}

EnttecUSBDMXPRO.prototype.get = function(c) {
	return this.universe[c]
}

module.exports = EnttecUSBDMXPRO
