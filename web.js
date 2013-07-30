var http  = require('http'),
	path = require('path'),
	io   = require('socket.io'),
	fs   = require('fs'),
	A = require('./anim.js').Anim
	;

exports.init = function(dmx) {
	function handler (request, response) {
		var reqBody = '';
	
		request.on("data", function (chunk) {
			reqBody += chunk;
		});
		
		request.on("end", function () {
			var urlData = require('url').parse(request.url);
			
			if(urlData.pathname == '/foursquare_checkin') {
				response.end();
				
				// save old states
				var universe = 'office', old = {}, black = {};
				for(var i = 0; i < 256; i++) {
					old[i] = dmx.drivers[universe].get(i);
				}
				for(var i = 0; i < 256; i++) {
					black[i] = 0;
				}
				
				var x = new A(dmx.drivers[universe])
					.add(black, 1000)
					.delay(2000)
					.add({ 0:16,  1:255,  2:0,  3:255,  4: 39,  5:0, 15: 1, 16:255, 17:0, 18:255, 19: 255, 20:0, 21:0, 22: 0, 23:0, 24:128, 25: 0, 26:255, 31:255, 32: 60 }, 1000)
					.delay(2000)
					.add(black, 1000)
					.delay(2000)
					.add(old, 1000)
					
				x.run(function () {});
				return;
			}
			
			var filePath = '.' + urlData.pathname;
			if (filePath == './')
				filePath = './index.html';

			var extname = path.extname(filePath);
			var contentType = 'text/html';
			switch (extname) {
				case '.js':	 contentType = 'text/javascript'; break;
				case '.css': contentType = 'text/css';        break;
			}

			fs.exists(filePath, function(exists) {
				if(!exists) {
					console.log('404: ' + request.url)
					response.writeHead(404);
					response.end();
					return;
				}

				fs.readFile(filePath, function(error, content) {
					if (error) {
						console.log('500: ' + request.url)
						response.writeHead(500);
						response.end();
						return;
					}

					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				});
			});
		});
	}


	var app = http.createServer(handler)
	app.listen(dmx.config.port, '::', null, function() {
		try {
			process.setgid(dmx.config.gid);
			process.setuid(dmx.config.uid);
		} catch (err) {
			console.log(err);
			process.exit(1);
		}
	});

	io.listen(app).sockets.on('connection', function (socket) {
		socket.emit('init', {'devices': dmx.devices, 'setup': dmx.setup});
		socket.on('request_refresh', function() {
			for(var universe in dmx.setup.universes) {
				u = {}
				for(var i = 0; i < 256; i++) {
					u[i] = dmx.drivers[universe].get(i);
				}
				console.log('sending update...')
				console.log(u)
				socket.emit('update', universe, u);
			}
		});
		
		dmx.on('update', function(universe, update){
		    socket.emit('update', universe, update);
		});
		
		socket.on('update', function(universe, update) {
			dmx.update(universe, update);
		});
	});
}	






