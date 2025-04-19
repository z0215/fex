import { clamp } from './number/clamp'
import { random } from './number/random'

interface ProgressOptions {
  /**
   * The maximum progress that can be displayed when it is not yet completed
   *
   * @default 0.994
   */
  max?: number
  /**
   * Callback when progress change
   */
  onProgress?: (n: number) => void
}
/**
 * @example
 * const p = progress({
 *   onProgress: (n) => console.log(`Progress: ${n}`)
 * });
 *
 * // Start the progress updates
 * p.start();
 *
 * // Manually increment the progress
 * setTimeout(() => {
 *   p.inc();
 *   console.log('Manual increment');
 * }, 2000);
 *
 * // Manually set the progress
 * setTimeout(() => {
 *   p.set(0.8);
 *   console.log('Manual set');
 * }, 2000);
 *
 * // Stop the progress after 5 seconds
 * setTimeout(() => {
 *   p.stop();
 *   console.log('Progress stopped');
 * }, 5000);
 *
 * // Complete the progress after 7 seconds
 * setTimeout(() => {
 *   p.done();
 *   console.log('Progress completed');
 * }, 7000);
 */
export const progress = (options?: ProgressOptions) => {
  const { max = 0.994, onProgress } = options ?? {}
  let isStop = false
  let progress = 0
  const inc = () => {
    let amount = 0

    switch (true) {
      case progress >= 0 && progress < 0.2:
        amount = 0.1
        break
      case progress >= 0.2 && progress < 0.5:
        amount = 0.04
        break
      case progress >= 0.5 && progress < 0.8:
        amount = 0.02
        break
      case progress >= 0.8 && progress < 0.99:
        amount = 0.005
        break
      default:
        amount = 0
        break
    }

    return clamp(progress + amount, 0, max)
  }
  const set = (n: number) => {
    progress = n
    onProgress?.(n)
  }
  const start = (n = 0) => {
    if (isStop) {
      isStop = false
    }
    else {
      set(n)
    }

    const work = () => {
      if (progress >= max || isStop) {
        return
      }

      set(inc())

      const timer = setTimeout(() => {
        work()
        clearTimeout(timer)
      }, random(300, 800))
    }

    work()
  }
  const stop = () => {
    isStop = true
  }
  const done = () => set(1)

  return {
    start,
    set,
    done,
    stop,
    inc() {
      set(inc())
    },
  }
}
