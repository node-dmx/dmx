
var drv = require('./drivers/enttec-usb-dmx-pro.js');
universe = new drv.init(0);
universe.update({0: 1, 1:0xff, 6: 20, 7: 0xff}, 20)



