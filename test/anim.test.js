const DMX = require('dmx');

const dmx = new DMX();
const universe = dmx.addUniverse('test', 'null', 'test');

const updateMock = jest.fn();
universe.update = updateMock

universe.update({ 1: 255 })

const ANIM_PRECISION = 5

test('fake timers', () => {
  jest.useFakeTimers();

  const animation = new DMX.Animation().add({
    1: 255,
  }, 100).add({
    1: 0,
  }, 100).run(universe)

  jest.runAllTimers();

  expect(updateMock).toHaveBeenCalledWith({ 1: 255 });
  expect(updateMock).toHaveBeenCalledWith({ 1: 0 });
});

test('real timers', done => {
  jest.useRealTimers()

  const startAt = Date.now();
  const animation = new DMX.Animation().add({
    1: 255,
  }, 100).add({
    1: 0,
  }, 100).run(universe, () => {
    const timeTook = Date.now() - startAt
    expect(timeTook).toBeGreaterThanOrEqual(200 - ANIM_PRECISION);
    expect(timeTook).toBeLessThanOrEqual(200 + ANIM_PRECISION);
    done();
  })

})