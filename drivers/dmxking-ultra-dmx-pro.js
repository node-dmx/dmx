"use strict"

var SerialPort = require("serialport")

var	  DMXKING_ULTRA_DMX_PRO_DMX_STARTCODE   = 0x00
	, DMXKING_ULTRA_DMX_PRO_START_OF_MSG    = 0x7e
	, DMXKING_ULTRA_DMX_PRO_END_OF_MSG      = 0xe7
	, DMXKING_ULTRA_DMX_PRO_SEND_DMX_RQ     = 0x06
	, DMXKING_ULTRA_DMX_PRO_SEND_DMX_A_RQ   = 0x64
	, DMXKING_ULTRA_DMX_PRO_SEND_DMX_B_RQ   = 0x65
	, DMXKING_ULTRA_DMX_PRO_RECV_DMX_PKT    = 0x05
	;

function DMXKingUltraDMXPro(device_id, options) {
	var self = this
	this.options = options || {}
	this.universe = new Buffer(513)
	this.universe.fill(0)
	
	this.sendDMXReq = DMXKING_ULTRA_DMX_PRO_SEND_DMX_RQ
	if (this.options.port === "A") {
		this.sendDMXReq = DMXKING_ULTRA_DMX_PRO_SEND_DMX_A_RQ
	} else if (this.options.port === "B") {
		this.sendDMXReq = DMXKING_ULTRA_DMX_PRO_SEND_DMX_B_RQ
	}
	
	this.dev = new SerialPort(device_id, {
		'baudRate': 250000,
		'databits': 8,
		'stopbits': 2,
		'parity': 'none'
	}, function(err) {
		if(!err) {
			self.send_universe()
		}
	})
}

DMXKingUltraDMXPro.prototype.send_universe = function() {
	if(!this.dev.writable) {
		return
	}
	var hdr = Buffer([
		DMXKING_ULTRA_DMX_PRO_START_OF_MSG,
		this.sendDMXReq,
		 (this.universe.length)       & 0xff,
		((this.universe.length) >> 8) & 0xff,
		DMXKING_ULTRA_DMX_PRO_DMX_STARTCODE
	])

	var msg = Buffer.concat([
		hdr,
		this.universe.slice(1),
		Buffer([DMXKING_ULTRA_DMX_PRO_END_OF_MSG])
	])
	this.dev.write(msg)
}

DMXKingUltraDMXPro.prototype.start = function() {}
DMXKingUltraDMXPro.prototype.stop = function() {}

DMXKingUltraDMXPro.prototype.close = function(cb) {
	this.dev.close(cb)
}

DMXKingUltraDMXPro.prototype.update = function(u) {
	for(var c in u) {
		this.universe[c] = u[c]
	}
	this.send_universe()
}

DMXKingUltraDMXPro.prototype.updateAll = function(v){
	for(var i = 1; i <= 512; i++) {
		this.universe[i] = v
	}
	this.send_universe()
}

DMXKingUltraDMXPro.prototype.get = function(c) {
	return this.universe[c]
}

module.exports = DMXKingUltraDMXPro
