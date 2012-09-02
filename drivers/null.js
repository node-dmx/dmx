exports.init = function(dev_id) {
	var universe = new Buffer(512)
	universe.fill(0)
	
	this.update = function(u) {
		console.log(u);
	}

	this.get = function(k) {
		return universe[k];
	}
	return this;
}
