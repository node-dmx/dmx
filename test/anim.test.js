const DMX = require('dmx');

const dmx = new DMX();
const universe = dmx.addUniverse('test', 'null', 'test');

const updateMock = jest.fn();

universe.update = updateMock;
universe.update({ 1: 255 });

const ANIM_PRECISION = 50;

test('fake timers', () => {
  jest.useFakeTimers();

  new DMX.Animation().add({
    1: 255,
  }, 100).add({
    1: 0,
  }, 100).run(universe);

  jest.runAllTimers();

  expect(updateMock).toHaveBeenCalledWith({ 1: 255 }, { origin: 'animation' });
  expect(updateMock).toHaveBeenCalledWith({ 1: 0 }, { origin: 'animation' });
});

test('real timers', done => {
  jest.useRealTimers();

  const startAt = Date.now();

  new DMX.Animation().add({
    1: 255,
  }, 250).add({
    1: 0,
  }, 250).run(universe, () => {
    const timeTook = Date.now() - startAt;

    expect(timeTook).toBeGreaterThanOrEqual(500 - ANIM_PRECISION);
    expect(timeTook).toBeLessThanOrEqual(500 + ANIM_PRECISION);
    done();
  });

});
