const ease = require('./easing.js').ease;

class Anim {
  constructor({ targetFPS } = {}) {
    this.targetFPS = targetFPS || 1;
    this.fxStack = [];
    this.timeout = null;
    this.lastFrameAt = 0;
  }

  add(to, duration = 0, options = {}) {
    options.easing = options.easing || 'linear';

    this.fxStack.push({ 'to': to, 'duration': duration, 'options': options });
    return this;
  }

  delay(duration) {
    this.add({}, duration);
    return this;
  }

  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.fxStack = [];
  }

  run(universe, onFinish) {
    let config = {};
    let elapsedTime = 0;
    let duration = 0;
    let animationStep;
    let lastFrameTime;

    const stack = [ ...this.fxStack ];

    const runNext = (animationStepFunction) => {
      if (stack.length === 0) {
        if (onFinish) {
          onFinish();
        }
        return;
      }

      animationStep = stack.shift();
      duration = animationStep.duration;
      elapsedTime = 0;
      lastFrameTime = Date.now();

      config = {};
      for (const k in animationStep.to) {
        config[k] = {
          'start': universe.get(k),
          'end': animationStep.to[k],
          'options': animationStep.options,
        };
      }

      animationStepFunction();
    };

    const aniStep = () => {
      const now = new Date();
      const frameElapsedTime = now - lastFrameTime;

      this.timeout = setTimeout(aniStep, this.targetFPS);
      lastFrameTime = now;

      if (elapsedTime >= duration) {
        const newValues = {};

        for (const k in config) {
          newValues[k] = config[k].end || 0;
        }
        universe.update(newValues);

        clearTimeout(this.timeout);
        runNext(aniStep);
      } else {
        const newValues = {};

        for (const k in config) {
          const entry = config[k];
          const easing = ease[entry.options.easing];
          const offset = easing(Math.min(elapsedTime, duration), 0, 1, duration) * (entry.end - entry.start);

          newValues[k] = Math.round(entry.start + offset);
        }
        universe.update(newValues, { skipIfBusy: true });
      }

      elapsedTime = elapsedTime + frameElapsedTime;
    };

    runNext(aniStep);

    return this;
  }

  runLoop(universe) {
    const doAnimation = () => {
      this.run(universe, () => {
        setImmediate(doAnimation);
      });
    };

    doAnimation();

    return this;
  }
}

module.exports = Anim;
