import type { Target } from '../getTarget'
import type { Coordinates, DragOptions } from './drag'
import { useEffect, useState } from 'react'
import { getTarget } from '../getTarget'
import { drag } from './drag'

export type { Coordinates } from './drag'

export interface UseDraggableOptions extends DragOptions {
  target?: Target<HTMLElement>
}

/**
 * @example
 * const { transform, position, isDragging } = useDraggable({
 *   target: targetRef,
 *   onStart(e) {},
 *   onMove(e) {},
 *   onEnd(e) {},
 *   disabled: false
 * })
 */
export const useDraggable = (options?: UseDraggableOptions) => {
  const { disabled, target, ...config } = options ?? {}
  const [position, setPosition] = useState<Coordinates>()
  const [transform, setTransform] = useState<Coordinates>()
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const element = getTarget(target)
    if (!element)
      return
    const dispose = drag(
      element,
      ({ position, transform, isDragging }) => {
        setPosition(position)
        setTransform(transform)
        setIsDragging(isDragging)
      },
      {
        ...config,
        disabled,
      },
    )
    return () => dispose()
  }, [disabled])

  return {
    position,
    transform,
    isDragging,
  }
}
