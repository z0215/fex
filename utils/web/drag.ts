export interface Coordinates {
  x: number
  y: number
}

export interface Result {
  position: Coordinates
  transform: Coordinates
  isDragging: boolean
  event: PointerEvent
}

export interface DragOptions {
  disabled?: boolean
  onStart?: (payload: Result) => void
  onMove?: (payload: Result) => void
  onEnd?: (payload: Result) => void
}

export interface PressedDelta {
  isDragging: boolean
  event?: PointerEvent
  rect?: DOMRect
}

/**
 * @example
 * const dispose = drag(
 *   element,
 *   (e) => {},
 *   {
 *     disabled: false,
 *     onStart(e) {},
 *     onMove(e) {},
 *     onEnd(e) {},
 *   },
 * )
 */
export const drag = (
  el: HTMLElement,
  handler: (payload: Result) => void,
  options?: DragOptions,
) => {
  const {
    disabled,
    onStart,
    onMove,
    onEnd,
  } = options ?? {}

  const pressedDelta: PressedDelta = {
    isDragging: false,
  }
  const positionDelta: Coordinates = { x: 0, y: 0 }
  const transformDelta: Coordinates = { x: 0, y: 0 }

  const onPointerdown = (event: PointerEvent) => {
    if (disabled)
      return
    event.preventDefault()
    const targetRect = el.getBoundingClientRect()
    pressedDelta.event = event
    pressedDelta.rect = targetRect
    pressedDelta.isDragging = true
    positionDelta.x = targetRect.x
    positionDelta.y = targetRect.y
    transformDelta.x = 0
    transformDelta.y = 0

    handler({
      position: { ...positionDelta },
      transform: { ...transformDelta },
      isDragging: pressedDelta.isDragging,
      event,
    })
    onStart?.({
      position: { ...positionDelta },
      transform: { ...transformDelta },
      isDragging: pressedDelta.isDragging,
      event,
    })
  }

  const onPointermove = (event: PointerEvent) => {
    if (!pressedDelta.isDragging || !pressedDelta.event || !pressedDelta.rect)
      return
    event.preventDefault()
    positionDelta.x = event.clientX - (pressedDelta.event.clientX - pressedDelta.rect.left)
    positionDelta.y = event.clientY - (pressedDelta.event.clientY - pressedDelta.rect.top)
    transformDelta.x = event.clientX - pressedDelta.event.clientX
    transformDelta.y = event.clientY - pressedDelta.event.clientY
    handler({
      position: { ...positionDelta },
      transform: { ...transformDelta },
      isDragging: pressedDelta.isDragging,
      event,
    })
    onMove?.({
      position: { ...positionDelta },
      transform: { ...transformDelta },
      isDragging: pressedDelta.isDragging,
      event,
    })
  }

  const onPointerup = (event: PointerEvent) => {
    if (!pressedDelta.isDragging)
      return
    pressedDelta.isDragging = false
    handler({
      position: { ...positionDelta },
      transform: { ...transformDelta },
      isDragging: pressedDelta.isDragging,
      event,
    })
    onEnd?.({
      position: { ...positionDelta },
      transform: { ...transformDelta },
      isDragging: pressedDelta.isDragging,
      event,
    })
  }

  el.addEventListener('pointerdown', onPointerdown)
  document.addEventListener('pointermove', onPointermove)
  document.addEventListener('pointerup', onPointerup)

  return () => {
    el.removeEventListener('pointerdown', onPointerdown)
    document.removeEventListener('pointermove', onPointermove)
    document.removeEventListener('pointerup', onPointerup)
  }
}
