import type { VirtualListOptions } from './virtualList'
import { useEffect, useRef, useState } from 'react'
import { getTarget, type Target } from '../getTarget'
import { useMemoFn } from '../useMemoFn'
import { virtualList } from './virtualList'

export type UseVirtualListOptions<T> = VirtualListOptions<T> & {
  container?: Target<HTMLElement>
}

/**
 * @example
 * const { height, marginTop, list, scrollTo } = useVirtualList({
 *   container: containerRef,
 *   itemHeight: 30,
 *   data,
 * })
 */
export const useVirtualList = <T>(options: UseVirtualListOptions<T>) => {
  const { container, data, overscan = 10, ...config } = options

  const scrollToRef = useRef<(index: number) => void>()
  const scrollTo = useMemoFn((index: number) => {
    scrollToRef.current?.(index)
  })

  const [list, setList] = useState<T[]>([])
  const [height, setHeight] = useState(0)
  const [marginTop, setMarginTop] = useState(0)
  useEffect(() => {
    const element = getTarget(container)
    if (!element)
      return
    const { dispose, scrollTo } = virtualList(element, {
      ...config,
      overscan,
      data,
      onChange({ list, height, marginTop }) {
        setList(list)
        setHeight(height)
        setMarginTop(marginTop)
      },
    })
    scrollToRef.current = scrollTo
    return dispose
  }, [data])

  return {
    scrollTo,
    list,
    height,
    marginTop,
  }
}
