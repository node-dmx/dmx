var drv = require('./drivers/enttec-usb-dmx-pro.js');
universe = new drv.init(0);
universe.update({0: 1, 1: 0})

function done() {console.log('DONE')}

var A = require('./anim.js').Anim;
var x = new A(universe)
	.add({1: 255, 6: 110, 7: 255, 8: 10}, 1200)
	.delay(1000)
	.add({1: 0}, 600)
	.add({1: 255}, 600)
	.add({5: 255, 6: 128}, 1000)
	.add({1: 0}, 100)
	.add({1: 255}, 100)
	.add({1: 0}, 200)
	.add({1: 255}, 200)
	.add({1: 0}, 100)
	.add({1: 255}, 100)
	.run(done);