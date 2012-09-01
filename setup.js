exports.setup = {
	universes: {
		'office': {
			'output': {
				'driver': 'enttec-usb-dmx-pro',
				'device': 0
			},
			'devices': [
				{
					'type': 'eurolite-led-bar',
					'address': 1
				},
				{
					'type': 'eurolite-led-bar',
					'address': 13
				}
			]
		}
	}
}
