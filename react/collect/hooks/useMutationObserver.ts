import type { Target } from './getTarget'
import { useEffect, useRef } from 'react'
import { getTarget } from './getTarget'
import { useMemoFn } from './useMemoFn'

export interface UseMutationObserverOptions extends MutationObserverInit {
  target?: Target<Element>
  disabled?: boolean
  onChange?: MutationCallback
}

/**
 * @example
 * const { setNodeRef, nodeRef } = useMutationObserver({ target: domRef })
 *
 * useMutationObserver({
 *   target: domRef,
 *   onChange: fn,
 *   disabled: false
 * })
 */
export const useMutationObserver = (options?: UseMutationObserverOptions) => {
  const { target, disabled, onChange, ...config } = options ?? {}
  const nodeRef = useRef<Element | null>(null)
  const setNodeRef = useMemoFn((element: Element | null) => {
    nodeRef.current = element
  })
  const onChangeFn = useMemoFn(onChange)
  useEffect(() => {
    const element = target ? getTarget(target) : nodeRef.current
    if (!element)
      return
    const ob = new MutationObserver((...args) => {
      onChangeFn(...args)
    })
    ob.observe(element, config)
    return () => ob.disconnect()
  }, [disabled])

  return {
    setNodeRef,
    nodeRef,
  }
}
