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
			var urlData = require('url').parse(request.url), 
				urlPath = urlData.pathname.split('/');
			
			if(urlPath.length == 3 && urlPath[1] == 'animation') {
				try {
					// save old states
					var universe = dmx.drivers[urlPath[2]], old = {}, black = {};
					for(var i = 0; i < 256; i++) {
						old[i] = universe.get(i);
						black[i] = 0;
					}

					var jsonAnim = JSON.parse(reqBody), animation = new A();
					for(var step in jsonAnim) {
						animation.add(jsonAnim[step].to, jsonAnim[step].duration || 0, jsonAnim[step].options || {});
					}
				
					animation.add(old, 0);
					animation.run(universe);
					response.write('{ "success": true }');
				} catch(e) {
					response.write('{ "error": "broken json" }');
				}
				
				response.end();
				
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






