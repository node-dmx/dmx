const ease = require('./easing.js').ease;

class Anim {
  constructor({ targetFPS, loop } = {}) {
    this.targetFrameDelay = targetFPS ? (1000 / targetFPS) : 1;
    this.animations = [];
    this.lastAnimation = 0;
    this.timeout = null;
    this.duration = 0;
    this.startTime = null;
    this.loops = loop || 1;
    this.currentLoop = 0;
  }

  add(to, duration = 0, options = {}) {
    options.easing = options.easing || 'linear';

    this.animations.push({
      to,
      from: options.from,
      options: { easing: options.easing },
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

  reset(startTime = new Date().getTime()) {
    this.startTime = startTime;
    this.lastAnimation = 0;
  }

  runNextLoop(universe, onFinish) {
    const runAnimationStep = () => {
      const now = new Date().getTime();
      const elapsedTime = now - this.startTime;

      this.timeout = setTimeout(runAnimationStep, this.targetFrameDelay);

      // Find the animation for the current point in time, the latest if multiple match

      let currentAnimation = this.lastAnimation;

      while (currentAnimation < this.animations.length && elapsedTime >= this.animations[currentAnimation].end) {
        currentAnimation++;
      }

      // Ensure final state of all newly completed animations have been set

      const completedAnimations = this.animations.slice(this.lastAnimation, currentAnimation);

      if (completedAnimations.length) {
        const completedAnimationStatesToSet = Object.assign({}, ...completedAnimations.map((a) => a.to));

        universe.update(completedAnimationStatesToSet);
      }

      this.lastAnimation = currentAnimation;

      if (elapsedTime >= this.duration) {
        // This animation loop is complete
        this.currentLoop++;
        this.stop();
        if (this.currentLoop >= this.loops) {
          // All loops complete
          if (onFinish) {
            onFinish();
          }
        } else {
          // Run next loop
          this.reset(this.startTime + this.duration);
          this.runNextLoop(universe);
        }
      } else {
        // Set intermediate channel values during an animation
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
          universe.update(intermediateValues);
        }
      }
    };

    runAnimationStep();

    return this;
  }

  run(universe, onFinish) {
    this.reset();
    this.runNextLoop(universe, onFinish);
  }

  runLoop(universe, onFinish, loops = Infinity) {
    this.loops = loops;
    this.run(universe, onFinish);
    return this;
  }
}

module.exports = Anim;
