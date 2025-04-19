/**
 * Custom defer load, for performance optimization
 *
 * @example
 * const defer = useDefer()
 * v-if="defer(100)"
 */

export const useDefer = (maxFrameCount = 1000) => {
  let frameCount = $ref(0)

  const refreshFrameCount = () => {
    requestAnimationFrame(() => {
      frameCount++

      if (frameCount > maxFrameCount)
        return

      refreshFrameCount()
    })
  }

  refreshFrameCount()

  return (showInFrameCount: number) => frameCount >= showInFrameCount
}
