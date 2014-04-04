"use strict"

var FTDI = require('ftdi')

var	ENTTEC_PRO_DMX_STARTCODE = 0x00
	, ENTTEC_PRO_START_OF_MSG  = 0x7e
	, ENTTEC_PRO_END_OF_MSG    = 0xe7
	, ENTTEC_PRO_SEND_DMX_RQ   = 0x06
	;

function EnttecOpenUsbDMX(device_id, cb) {
	var self = this
	cb = cb || function() {}
	this.universe = new Buffer(512)
	this.universe.fill(0)
	
	this.dev = new FTDI.FtdiDevice(device_id)
	this.dev.open({
		'baudrate': 115200,
		'databits': 8,
		'stopbits': 2,
		'parity': 'none'
	}, function(err) {
		cb(err, device_id)
		if(!err) {
			self.send_universe()
		}
	})
}

EnttecOpenUsbDMX.prototype.send_universe = function() {
	var hdr = Buffer([
		ENTTEC_PRO_START_OF_MSG,
		ENTTEC_PRO_SEND_DMX_RQ,
		 // (this.universe.length + 1)       & 0xff,
	  ((this.universe.length + 1) >> 0) & 0xff,
		((this.universe.length + 1) >> 8) & 0xff,
		ENTTEC_PRO_DMX_STARTCODE
	])

	var msg = Buffer.concat([
		hdr,
		this.universe,
		Buffer([ENTTEC_PRO_END_OF_MSG])
	])
	this.dev.write(msg)
}

EnttecOpenUsbDMX.prototype.update = function(u) {
	for(var c in u) {
		this.universe[c] = u[c]
	}
	this.send_universe()
}

EnttecOpenUsbDMX.prototype.get = function(c) {
	return this.universe[c]
}

module.exports = EnttecOpenUsbDMX