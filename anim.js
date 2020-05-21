const ease = require('./easing.js').ease;

class Anim {
  constructor({ loop, filter } = {}) {
    this.frameDelay = 1;
    this.animations = [];
    this.lastAnimation = 0;
    this.timeout = null;
    this.duration = 0;
    this.startTime = null;
    this.loops = loop || 1;
    this.currentLoop = 0;
    this.filter = filter;
  }

  add(to, duration = 0, options = {}) {
    options.easing = options.easing || 'linear';

    this.animations.push({
      to,
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

  reset(startTime = new Date().getTime()) {
    this.startTime = startTime;
    this.lastAnimation = 0;
  }

  runNextLoop(universe, onFinish) {
    const runAnimationStep = () => {
      const now = new Date().getTime();
      const elapsedTime = now - this.startTime;

      this.timeout = setTimeout(runAnimationStep, this.frameDelay);

      // Find the animation for the current point in time, the latest if multiple match

      let currentAnimation = this.lastAnimation;

      while (
        currentAnimation < this.animations.length &&
        elapsedTime >= this.animations[currentAnimation].end
      ) {
        currentAnimation++;
      }

      // Ensure final state of all newly completed animations have been set
      const completedAnimations = this.animations.slice(
        this.lastAnimation,
        currentAnimation
      );

      // Ensure future animations interpolate from the most recent state
      completedAnimations.forEach(completedAnimation => {
        delete completedAnimation.from;
      });

      if (completedAnimations.length) {
        const completedAnimationStatesToSet = Object.assign(
          {},
          ...completedAnimations.map(a => a.to)
        );

        if (typeof this.filter === 'function') {
          this.filter(completedAnimationStatesToSet);
        }

        universe.update(completedAnimationStatesToSet, { origin: 'animation' });
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
          if (animation.options.from) {
            animation.from = Object.assign(animation.from, animation.options.from);
          }
        }

        if (duration) {
          const easeProgress = easing(
            Math.min(animationElapsedTime, duration),
            0,
            1,
            duration
          );
          const intermediateValues = {};

          for (const k in animation.to) {
            const startValue = animation.from[k];
            const endValue = animation.to[k];

            intermediateValues[k] = Math.round(
              startValue + easeProgress * (endValue - startValue)
            );
          }

          if (typeof this.filter === 'function') {
            this.filter(intermediateValues);
          }

          universe.update(intermediateValues, { origin: 'animation' });
        }
      }
    };

    runAnimationStep();

    return this;
  }

  run(universe, onFinish) {
    if (universe.interval) {
      // Optimisation to run animation updates at double the rate of driver updates using Nyquist's theorem
      this.frameDelay = universe.interval / 2;
    }
    this.reset();
    this.currentLoop = 0;
    this.runNextLoop(universe, onFinish);
  }

  runLoop(universe, onFinish, loops = Infinity) {
    this.loops = loops;
    this.run(universe, onFinish);
    return this;
  }
}

module.exports = Anim;
