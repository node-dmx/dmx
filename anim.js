const ease = require('./easing.js').ease;

class Anim {
  constructor({ targetFPS } = {}) {
    this.targetFrameDelay = targetFPS ? (1000 / targetFPS) : 1;
    this.animations = [];
    this.lastAnimation = 0;
    this.timeout = null;
    this.duration = 0;
    this.startTime = 0;
  }

  add(to, duration = 0, options = {}) {
    options.easing = options.easing || 'linear';

    this.animations.push({
      to,
      from: options.from,
      options,
      start: this.duration,
      end: this.duration + duration,
    });
    this.duration += duration;

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
  }

  run(universe, onFinish) {
    this.startTime = new Date();
    this.lastAnimation = 0;

    const runAnimationStep = () => {
      const now = new Date();
      const elapsedTime = now - this.startTime;

      this.timeout = setTimeout(runAnimationStep, this.targetFrameDelay);

      let currentAnimation = this.lastAnimation;

      while (currentAnimation < this.animations.length && elapsedTime >= this.animations[currentAnimation].end) {
        currentAnimation++;
      }

      const completedAnimations = this.animations.slice(this.lastAnimation, currentAnimation);

      if (completedAnimations.length) {
        const completedAnimationStatesToSet = Object.assign({}, ...completedAnimations.map((a) => a.to));

        universe.update(completedAnimationStatesToSet);
      }

      if (elapsedTime >= this.duration) {
        this.stop();
        if (onFinish) {
          onFinish();
        }
      } else {
        const animation = this.animations[currentAnimation];
        const easing = ease[animation.options.easing];
        const duration = animation.end - animation.start;
        const animationElapsedTime = elapsedTime - animation.start;

        if (!animation.from) {
          animation.from = {};
          for (const k in animation.to) {
            animation.from[k] = universe.get(k);
          }
        }

        if (duration) {
          const easeProgress = easing(Math.min(animationElapsedTime, duration), 0, 1, duration);
          const intermediateValues = {};

          for (const k in animation.to) {
            const startValue = animation.from[k];
            const endValue = animation.to[k];

            intermediateValues[k] = Math.round(startValue + easeProgress * (endValue - startValue));
          }
          universe.update(intermediateValues, { skipIfBusy: true });
        }
      }

      this.lastAnimation = currentAnimation;
    };

    runAnimationStep();

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
