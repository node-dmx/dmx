var    events = require('events')
	,  config = require('./config.js')
	,     web = require('./web.js')
	,   setup = require('./setup.js').setup
	, devices = require('./devices.js').devices
	;
	

var dmx = new events.EventEmitter();

dmx.config  = config;
dmx.setup   = setup;
dmx.devices = devices;
dmx.drivers = {};


dmx.update = function(universe, update) {
	dmx.drivers[universe].update(update);
	dmx.emit('update', universe, update);
}
	
for(var universe in setup.universes) {
	dmx.drivers[universe] = require('./drivers/' + setup.universes[universe].output.driver + '.js').init(setup.universes[universe].output.device);
}


web.init(dmx);
