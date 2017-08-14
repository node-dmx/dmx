"use strict";

const SerialPort = require("serialport");

const	  ENTTEC_PRO_DMX_STARTCODE = 0x00
, ENTTEC_PRO_START_OF_MSG  = 0x7e
, ENTTEC_PRO_END_OF_MSG    = 0xe7
, ENTTEC_PRO_SEND_DMX_RQ   = 0x06
, ENTTEC_PRO_RECV_DMX_PKT  = 0x05
;

const EnttecUSBDMXPRO = class EnttecUSBDMXPRO {
	constructor(device_id, options) {
		options = options || {};
		this.universe = new Buffer(512);
		this.universe.fill(0);
		
		this.dev = new SerialPort(device_id, {
			'baudrate': 250000,
			'databits': 8,
			'stopbits': 2,
			'parity': 'none'
		}, (err) => {
			if(!err) {				
				this.send_universe();
			}
		})
	}

	send_universe () {
		if(!this.dev.isOpen()) {
			return;
		}
		const hdr = Buffer([
			ENTTEC_PRO_START_OF_MSG,
			ENTTEC_PRO_SEND_DMX_RQ,
			 (this.universe.length + 1)       & 0xff,
			((this.universe.length + 1) >> 8) & 0xff,
			ENTTEC_PRO_DMX_STARTCODE
		]);
	
		const msg = Buffer.concat([
			hdr,
			this.universe,
			Buffer([ENTTEC_PRO_END_OF_MSG])
		]);
		this.dev.write(msg);
	}

	start() {}
	stop()  {}

	close(cb) {
		this.dev.close(cb);
	}

	update(u) {
		for(let c in u) {
			this.universe[c] = u[c];
		}
		this.send_universe();
	}

	updateAll(v) {
		for(let i = 0; i < 512; i++) {
			this.universe[i] = v;
		}
		this.send_universe();
	}

	get(c) {
		return this.universe[c];
	}	
}

module.exports = EnttecUSBDMXPRO