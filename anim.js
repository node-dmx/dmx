var ease = require('./easing.js').ease
var resolution = 25;

exports.Anim = function(universe) {
	this.universe = universe;
	this.fx_stack = [];
	this.add = function(to, duration, options) {
		var options  = options  || {};
		var duration = duration || resolution;
		options['easing'] = options['easing'] || 'linear';
		this.fx_stack.push({'to': to, 'duration': duration, 'options': options});
		return this;
	}
	this.delay = function(duration) {
		return this.add({}, duration);
	}
	this.run = function(onFinish) {
		var   config = {}
			, t = 0
			, d = 0
			, a
			; 
		
		var fx_stack = this.fx_stack;
		var ani_setup = function() {
			a = fx_stack.shift();
			t = 0;
			d = a.duration;
			config = {}
			for(var k in a.to) {
				config[k] = {
					'start': universe.get(k),
					'end':   a.to[k]
				}
			}
		}
		var ani_step = function() {
			new_vals = {};
			for(var k in config) {
				new_vals[k] = Math.round(config[k].start + ease['linear'](t, 0, 1, d) * (config[k].end - config[k].start))
			}
			t = t + resolution;
			universe.update(new_vals);
			if(t > d) {
				if(fx_stack.length > 0) {
					ani_setup()
				} else {
					clearInterval(iid);
					if(onFinish) onFinish();	
				}
			}
		}
		ani_setup();
		var iid = setInterval(ani_step, resolution);
	}
}

