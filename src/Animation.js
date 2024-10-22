import ease from './easing.js'

/**
 * @typedef {typeof import('./drivers/index.js').AbstractDriver} Driver
 */

export default class Animation {
  /**
   * Construct an Animation instance.
   *
   * @param {object} [options] an object with options.
   * @param {number} [options.frameDelay=1] the delay between each frame in milliseconds.
   * @param {number} [options.loop=1] the number of times to loop.
   * @param {function} [options.filter] a function to call after all animations have completed a loop.
   */
  constructor(options = {}) {
    this.frameDelay = 1
    this.animations = []
    this.lastAnimation = 0
    this.timeout = null
    this.duration = 0
    this.startTime = null
    this.loops = options.loop || 1
    this.currentLoop = 0
    this.filter = options.filter
  }

  /**
   * Add an animation to the list of animations to run.
   *
   * @param {object} to the object with the properties to animate.
   * @param {number} [duration=0] the duration of the animation in milliseconds.
   * @param {object} [options] an object with options.
   * @param {function} [options.easing=ease.linear] the easing function to use.
   */
  add(to, duration = 0, options = {}) {
    options.easing = options.easing || ease.linear

    this.animations.push({
      to,
      options,
      start: this.duration,
      end: this.duration + duration,
    })

    this.duration += duration

    return this
  }

  /**
   *
   * @param {number} [duration]
   * @return {Animation}
   */
  delay(duration) {
    this.add({}, duration)

    return this
  }

  /**
   * Stop the animation.
   *
   * Clears the timeout so that the animation won't run again.
   */
  stop() {
    if (this.timeout != null) {
      clearTimeout(this.timeout)
    }
  }

  /**
   * Resets the animation to the start.
   *
   * Resets the animation to the start so that it can be run again.
   *
   * @param {number} [startTime] the start time to use. Defaults to the current time.
   */
  reset(startTime = new Date().getTime()) {
    this.startTime = startTime
    this.lastAnimation = 0
  }

  /**
   * Runs the next animation in the loop.
   *
   * @param {InstanceType<Driver>} universe the universe to run the animation on
   * @param {function} [onFinish] called when the animation is complete
   * @return {Animation}
   */
  runNextLoop(universe, onFinish) {
    const now = new Date().getTime()
    const elapsedTime = now - (this.startTime ?? 0)

    this.timeout = setTimeout(this.runNextLoop.bind(this, ...[universe, onFinish]), this.frameDelay)

    // Find the animation for the current point in time, the latest if multiple match

    let currentAnimation = this.lastAnimation

    while (
      currentAnimation < this.animations.length &&
      elapsedTime >= this.animations[currentAnimation].end
      ) {
      currentAnimation++
    }

    // Ensure final state of all newly completed animations have been set
    const completedAnimations = this.animations.slice(
      this.lastAnimation,
      currentAnimation,
    )

    // Ensure future animations interpolate from the most recent state
    completedAnimations.forEach(completedAnimation => {
      delete completedAnimation.from
    })

    if (completedAnimations.length) {
      const completedAnimationStatesToSet = Object.assign(
        {},
        ...completedAnimations.map(a => a.to),
      )

      if (typeof this.filter === 'function') {
        this.filter(completedAnimationStatesToSet)
      }

      universe.update(completedAnimationStatesToSet)
    }

    this.lastAnimation = currentAnimation

    if (elapsedTime >= this.duration) {
      // This animation loop is complete
      this.currentLoop++
      this.stop()

      if (this.currentLoop >= this.loops) {
        // All loops complete
        if (onFinish) {
          onFinish()
        }
      } else {
        // Run next loop
        this.reset((this.startTime ?? 0) + this.duration)
        this.runNextLoop(universe)
      }
    } else {
      // Set intermediate channel values during an animation
      const animation = this.animations[currentAnimation]
      const easing = ease[animation.options.easing]
      const duration = animation.end - animation.start
      const animationElapsedTime = elapsedTime - animation.start

      if (!animation.from) {
        animation.from = {}

        for (const k in animation.to) {
          animation.from[k] = universe.get(Number(k))
        }

        if (animation.options.from) {
          animation.from = Object.assign(animation.from, animation.options.from)
        }
      }

      if (duration) {
        const easeProgress = easing(
          Math.min(animationElapsedTime, duration),
          0,
          1,
          duration,
        )
        const intermediateValues = {}

        for (const k in animation.to) {
          const startValue = animation.from[k]
          const endValue = animation.to[k]

          intermediateValues[k] = Math.round(
            startValue + easeProgress * (endValue - startValue),
          )
        }

        if (typeof this.filter === 'function') {
          this.filter(intermediateValues)
        }

        universe.update(intermediateValues)
      }
    }

    return this
  }

  /**
   * Runs the animation.
   *
   * If the universe has an interval, animation updates will run at
   * double the rate of driver updates using Nyquist's theorem.
   *
   * @param {InstanceType<Driver>} universe The universe to run the animation on.
   * @param {Function} [onFinish] The function to call when the animation has finished all its loops.
   */
  run(universe, onFinish) {
    this.reset()
    this.currentLoop = 0
    this.runNextLoop(universe, onFinish)
  }

  /**
   * Runs the animation in a loop.
   *
   * @param {InstanceType<Driver>} universe The universe to run the animation on.
   * @param {Function} [onFinish] The function to call when the animation has finished all its loops.
   * @param {number} [loops=Infinity] The number of times the animation should loop.
   */
  runLoop(universe, onFinish, loops = Infinity) {
    this.loops = loops
    this.run(universe, onFinish)
    return this
  }
}
