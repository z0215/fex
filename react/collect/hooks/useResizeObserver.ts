import type { Target } from './getTarget'
import { useEffect, useRef, useState } from 'react'
import { getTarget } from './getTarget'
import { useMemoFn } from './useMemoFn'

export interface UseResizeObserverOptions extends ResizeObserverOptions {
  target?: Target<Element>
  disabled?: boolean
  onChange?: ResizeObserverCallback
}

/**
 * @example
 * const {
 *   size,
 *   setNodeRef,
 *   nodeRef
 * } = useResizeObserver({ target: domRef })
 *
 * useResizeObserver({
 *   target: domRef,
 *   onChange: fn,
 *   disabled: false
 * })
 */
export const useResizeObserver = (options?: UseResizeObserverOptions) => {
  const { target, disabled, onChange, ...config } = options ?? {}
  const [size, setSize] = useState<DOMRect>()
  const nodeRef = useRef<Element | null>(null)
  const setNodeRef = useMemoFn((element: Element | null) => {
    nodeRef.current = element
  })
  const onChangeFn = useMemoFn(onChange)
  useEffect(() => {
    const element = target ? getTarget(target) : nodeRef.current
    if (!element)
      return
    const ob = new ResizeObserver((...args) => {
      const rect = element.getBoundingClientRect()
      setSize(rect)
      onChangeFn(...args)
    })
    ob.observe(element, config)
    return () => ob.unobserve(element)
  }, [disabled])

  return {
    size,
    setNodeRef,
    nodeRef,
  }
}
