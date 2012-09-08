var Ftdi = require('./node-ftdi/index');


var	  ENTTEC_PRO_DMX_STARTCODE = 0x00
	, ENTTEC_PRO_START_OF_MSG  = 0x7e
	, ENTTEC_PRO_END_OF_MSG    = 0xe7
	, ENTTEC_PRO_SEND_DMX_RQ   = 0x06
	, ENTTEC_PRO_RECV_DMX_PKT  = 0x05
	;


exports.init = function(dev_id) {
	var send_universe = function(dev, universe) {
		var hdr = Buffer([
			ENTTEC_PRO_START_OF_MSG,
			ENTTEC_PRO_SEND_DMX_RQ,
			(universe.length + 1) & 0xff,
			((universe.length + 1) >> 8) & 0xff,
			ENTTEC_PRO_DMX_STARTCODE
			])

		var msg = 	Buffer.concat([
				hdr,
				universe,
				Buffer([ENTTEC_PRO_END_OF_MSG])
				])
		//console.log(msg)	
		dev.write(msg)
		dev.write(msg)
	}
	
	var universe = new Buffer(512)
	universe.fill(0)
	
	var dev = new Ftdi({'index': dev_id});
	dev.open();
	dev.setBaudrate(250000);
	dev.setLineProperty(Ftdi.BITS_8, Ftdi.STOP_BIT_2, Ftdi.NONE);
	
	this.update = function(u) {
		for(var k in u) {
			universe[k] = u[k]
		}
	}
	
	this.get = function(c) {
		return universe[c];
	}
	
	setInterval(function() {
		send_universe(dev, universe);
	}, 25);
	
	return this;
}
