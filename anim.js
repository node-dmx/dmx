const ease = require('./easing.js').ease;

class Anim {
  constructor({ targetFPS } = {}) {
    this.targetFPS = targetFPS || 1;
    this.fxStack = [];
    this.interval = null;
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
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.fxStack = [];
  }

  run(universe, onFinish) {
    let config = {};
    let elapsedTime = 0;
    let duration = 0;
    let animationStep;
    let iid = null;
    let lastFrameTime;

    const stack = [ ...this.fxStack ];

    const runNext = (callback) => {
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

      if (callback) {
        callback();
      }
    };

    const aniStep = () => {
      const now = new Date();
      const frameElapsedTime = now - lastFrameTime;

      lastFrameTime = now;
      iid = this.interval = setTimeout(aniStep, this.targetFPS);

      const newValues = {};

      for (const k in config) {
        const entry = config[k];
        const easing = ease[entry.options.easing];

        if (duration) {
          newValues[k] = Math.round(
            entry.start + easing(Math.min(elapsedTime, duration), 0, 1, duration) * (entry.end - entry.start)
          );
        } else {
          newValues[k] = entry.end || 0;
        }
      }

      elapsedTime = elapsedTime + frameElapsedTime;
      universe.update(newValues);
      if (elapsedTime >= duration) {
        clearTimeout(iid);
        if (stack.length > 0) {
          runNext(aniStep);
        } else {
          if (onFinish) {
            onFinish();
          }
        }
      }
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
