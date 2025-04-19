/**
 * Custom debounced ref, for performance optimization
 *
 * @example
 * const debounceRef = useDebouncedRef('')
 * v-model="debounceRef"
 */

export const useDebouncedRef = <T>(value: T, delay = 300) => {
  let timeout: NodeJS.Timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}
