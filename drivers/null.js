"use strict"

function Null(device_id, options) {
	var self = this
	options = options || {}
	this.universe = new Buffer(513)
	this.universe.fill(0)
	self.start()
}

Null.prototype.start = function() {
	var self = this
	self.timeout = setInterval(function() {
		console.log(self.universe)
	}, 1000)
}

Null.prototype.stop = function() {
	clearInterval(this.timeout)
}

Null.prototype.close = function(cb) {
	cb(null)
}

Null.prototype.update = function(u) {
	for(var c in u) {
		this.universe[c] = u[c]
	}
	console.log(this.universe.slice(1))
}

Null.prototype.updateAll = function(v){
	for(var i = 1; i <= 512; i++) {
		this.universe[i] = v
	}
}

Null.prototype.get = function(c) {
	return this.universe[c]
}

module.exports = Null