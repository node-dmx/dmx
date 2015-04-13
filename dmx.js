"use strict"

var util = require('util')
var EventEmitter = require('events').EventEmitter

function DMX() {
	this.universes = {}
	this.drivers   = {}

	this.registerDriver('null',                require('./drivers/null'))
	this.registerDriver('enttec-usb-dmx-pro',  require('./drivers/enttec-usb-dmx-pro'))
	this.registerDriver('enttec-open-usb-dmx', require('./drivers/enttec-open-usb-dmx'))
}

util.inherits(DMX, EventEmitter)

DMX.devices   = require('./devices')
DMX.Animation = require('./anim')

DMX.prototype.registerDriver = function(name, module) {
	this.drivers[name] = module
}

DMX.prototype.addUniverse = function(name, driver, device_id) {
	return this.universes[name] = new this.drivers[driver](device_id, function(error, locationId){
		if(error) throw error;
	})
}

DMX.prototype.update = function(universe, channels) {
	this.universes[universe].update(channels)
	this.emit('update', universe, channels)
}

DMX.prototype.updateAll = function(universe, value) {
  this.universes[universe].updateAll(value)
  this.emit('updateAll', universe, value)
}

module.exports = DMX
