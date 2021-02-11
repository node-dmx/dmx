import { Animation } from '../animation';
import { NullDriver } from '../drivers/null';
import {DMX} from '../index';
import { IUniverseDriver, UniverseData } from '../models/IUniverseDriver';

const dmx = new DMX();

// var universe = dmx.addUniverse('demo', 'enttec-usb-dmx-pro', '/dev/cu.usbserial-6AVNHXS8')
// var universe = dmx.addUniverse('demo', 'enttec-open-usb-dmx', '/dev/cu.usbserial-6AVNHXS8')
// const universe = dmx.addUniverse('demo', 'socketio', null, {port: 17809, debug: true});
const universe = dmx.addUniverse('demo', new NullDriver());

universe.update({1: 1, 2: 0});
universe.update({16: 1, 17: 255});
universe.update({1: 255, 3: 120, 4: 230, 5: 30, 6: 110, 7: 255, 8: 10, 9: 255, 10: 255, 11: 0});

function greenWater(universe: IUniverseDriver, channels: UniverseData, duration: number): void {
  const colors = [
    [160, 230, 20],
    [255, 255, 0],
    [110, 255, 10],
  ];

  for (const c in channels) {
    const r = Math.floor((Math.random() * colors.length));
    const u: UniverseData = {};

    for (let i = 0; i < 3; i++) {
      u[channels[c] + i] = colors[r][i];
    }
    new Animation().add(u, duration).run(universe);
  }
  setTimeout(() => greenWater(universe, channels, duration), duration * 2);
}

function warp(universe: IUniverseDriver, channel: number, min: number, max: number, duration: number): void {
  const a: UniverseData = {};
  const b: UniverseData = {};

  a[channel] = min;
  b[channel] = max;
  new Animation().add(a, duration).add(b, duration).run(universe, function () {
    warp(universe, channel, min, max, duration);
  });
}

warp(universe, 1, 200, 220, 360);
warp(universe, 1 + 15, 200, 255, 240);
greenWater(universe, [3, 6, 9], 4000);
greenWater(universe, [3 + 15, 6 + 15, 9 + 15], 4000);

// function done() { console.log('DONE'); }
//
// const x = new A()
//   .add({1: 255, 6: 110, 7: 255, 8: 10}, 1200)
//   .delay(1000)
//   .add({1: 0}, 600)
//   .add({1: 255}, 600)
//   .add({5: 255, 6: 128}, 1000)
//   .add({1: 0}, 100)
//   .add({1: 255}, 100)
//   .add({1: 0}, 200)
//   .add({1: 255}, 200)
//   .add({1: 0}, 100)
//   .add({1: 255}, 100)
//   .add({1: 0})
//   .delay(50)
//   .add({1: 255})
//   .delay(50)
//   .add({1: 0})
//   .delay(50)
//   .add({1: 255})
//   .delay(50)
//   .add({1: 0})
//   .delay(50)
//   .add({1: 255})
//   .delay(50)
//   .add({2: 255}, 6000)
//   .delay(200)
//   .add({2: 0});

// const y = new A()
//   .add({9: 255}, 10000);

// x.run(universe, done);
// y.run(universe, done);
