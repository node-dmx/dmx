# node-dmx

DMX-512 controller library for node.js

## Install

    npm install dmx

## Library API
```javascript
const DMX = require('dmx')
```

### Class DMX

#### new DMX()

Create a new DMX instance. This class is used to tie multiple universes together.

#### dmx.registerDriver(name, module)

- <code>name</code> - String
- <code>module</code> - Object implementing the Driver API


Register a new DMX Driver module by its name.
These drivers are currently registered by default:

- null: a development driver that prints the universe to stdout
- socketio: a driver which sends out the universe via socket.IO as an array (see [demo_socket_client.js](./demo_socket_client.js) as a client example)
- artnet: driver for EnttecODE
- bbdmx: driver for [BeagleBone-DMX](https://github.com/boxysean/beaglebone-DMX)
- dmx4all: driver for DMX4ALL devices like the "NanoDMX USB Interface"
- enttec-usb-dmx-pro: a driver for devices using a Enttec USB DMX Pro chip like the "DMXKing ultraDMX Micro".
- enttec-open-usb-dmx: driver for "Enttec Open DMX USB". This device is NOT recommended, there are known hardware limitations and this driver is not very stable. (If possible better obtain a device with the "pro" chip)
- dmxking-utra-dmx-pro: driver for the DMXKing Ultra DMX pro interface. This driver support multiple universe specify the options with Port = A or B

#### dmx.addUniverse(name, driver, device_id, options)

- <code>name</code> - String
- <code>driver</code> - String, referring a registered driver
- <code>device_id</code> - Number or Object
- <code>options</code> - Object, driver specific options

Add a new DMX Universe with a name, driver and an optional device_id used by the driver to identify the device.
For enttec-usb-dmx-pro and enttec-open-usb-dmx device_id is the path the the serial device. For artnet it is the target ip.

#### dmx.update(universe, channels[, extraData])

- <code>universe</code> - String, name of the universe
- <code>channels</code> - Object, keys are channel numbers, values the values to set that channel to
- <code>extraData</code> - Object, this data will be passed unmodified to the <code>update</code> Event. (Optional; default value is `{}`)

Update one or multiple channels of a universe. Also emits a <code>update</code> Event with the same information.


#### DMX.devices

A JSON Object describing some Devices and how many channels they use.
Currently not many devices are in there but more can be added to the <code>devices.js</code> file. Pull requests welcome ;-)

The following Devices are known:

- generic - a one channel dimmer
- showtec-multidim2 - 4 channel dimmer with 4A per channel
- eurolite-led-bar - Led bar with 3 RGB color segments and some programms
- stairville-led-par-56 - RGB LED Par Can with some programms

### Class DMX.Animation

#### new DMX.Animation([options])

Create a new DMX Animation instance. This can be chained similar to jQuery.

The options Object takes the following keys:

- <code>loop</code> - Number, the number of times this animation sequence will loop when <code>run</code> is invoked. This value is overridden if you invoke <code>runLoop</code>.
- <code>filter</code> - Function, allows you to read or modify the values being set to each channel during each animation step.

If you specify a <code>filter</code> function, it must take a single object parameter in which keys are channel numbers and values are the values to set those channels to.
You may modify the values in the object to override the values in real-time, for example to scale channel brightness based on a master fader.

#### animation.add(to, duration, options)

- <code>to</code> - Object, keys are channel numbers, values the values to set that channel to
- <code>duration</code> - Number, duration in ms
- <code>options</code> - Object

Add an animation Step.
The options Object takes an <code>easing</code> key which allows to set a easing function from the following list:

- linear (default)
- inQuad
- outQuad
- inOutQuad
- inCubic
- outCubic
- inOutCubic
- inQuart
- outQuart
- inOutQuart
- inQuint
- outQuint
- inOutQuint
- inSine
- outSine
- inOutSine
- inExpo
- outExpo
- inOutExpo
- inCirc
- outCirc
- inOutCirc
- inElastic
- outElastic
- inOutElastic
- inBack
- outBack
- inOutBack
- inBounce
- outBounce
- inOutBounce

Returns a Animation object with the animation step added.


#### animation.delay(duration)

- <code>duration</code> - Number, duration in ms

Delay the next animation step for duration.
Returns a Animation object with the delay step added.


#### animation.run(universe, onFinish)

- <code>universe</code> - Object, reference to the universe driver
- <code>onFinish</code> - Function, called when the animation is done

Run the Animation on the specified universe.

#### animation.runLoop(universe)

- <code>universe</code> - Object, reference to the universe driver

Runs an animation constantly until <code>animation.stop()</code> is called

The example below shows a value being animated for 5 seconds:
```javascript
const animation = new DMX.Animation().add({
  1: 255,
}, 100).add({
  1: 0,
}, 100).runLoop(universe)


setTimeout(() => {
  animation.stop()
}, 5000)
```

#### update Event

- <code>universe</code> - String, name of the universe
- <code>channels</code> - Object, keys are channel numbers, values the values to set that channel to
- <code>extraData</code> - Object, data that was passed to the <code>update</code> method.

This event is emitted whenever <code>update</code> is called either by the integrating application or by an animation step.

If triggered by an animation step, <code>extraData.origin</code> will be the string <code>'animation'</code>.

## Webinterface

Versions prior to 0.2 included a Webinterface. This has since been moved into its own repository at <https://github.com/node-dmx/dmx-web>

## Community

We're happy to help. Chat with us on IRC in #dmx on libera.chat.
