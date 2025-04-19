import type { ModalProps as AModalProps } from 'antd'
import type { ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'
import { isString, limit, useDraggable } from '~/shared'
import type { Coordinates } from '~/shared'

export interface UseModalOptions {
  width?: AModalProps['width']
  top?: number
  open?: AModalProps['open']
  draggable?: boolean
}

export const useModal = (options?: UseModalOptions): Omit<AModalProps, 'title'> & {
  title: (children?: ReactNode) => ReactNode
} => {
  const {
    width,
    top,
    open,
    draggable,
  } = options ?? {}
  const modalRef = useRef<HTMLDivElement>(null)
  const defaultCoordinates = useMemo(() => {
    // Follow Antd
    const defaultWidth = 520
    const defaultTop = 100
    const formatedWidth = isString(width)
      ? Number.parseFloat(width)
      : (width ?? defaultWidth)

    return {
      x: (window.innerWidth - formatedWidth) / 2,
      y: top ?? defaultTop,
    }
  }, [top, width])
  const [position, setPosition] = useState<Coordinates>(defaultCoordinates)
  const limitScope = useRef({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  })
  const dragRef = useRef<HTMLDivElement>(null)
  const { transform, isDragging } = useDraggable({
    target: dragRef,
    onStart() {
      const {
        left = 0,
        width = 0,
        top = 0,
        height = 0,
      } = modalRef.current?.getBoundingClientRect() ?? {}
      limitScope.current = {
        minX: -left,
        maxX: window.innerWidth - width - left,
        minY: -top,
        maxY: window.innerHeight - height - top,
      }
    },
    onEnd({ transform }) {
      const { width = 0, height = 0 } = modalRef.current?.getBoundingClientRect() ?? {}
      setPosition(({ x, y }) => ({
        x: limit(x + transform.x, 0, window.innerWidth - width),
        y: limit(y + transform.y, 0, window.innerHeight - height),
      }))
    },
    disabled: !draggable || !open,
  })
  const computedTransform = useMemo(() => {
    if (!transform)
      return transform
    const { minX, maxX, minY, maxY } = limitScope.current

    // Restrict To Window Edges
    return {
      x: limit(transform.x, minX, maxX),
      y: limit(transform.y, minY, maxY),
    }
  }, [transform])

  return {
    afterClose: () => setPosition(defaultCoordinates),
    title: children => (
      <div
        ref={dragRef}
        style={{
          cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'auto',
          userSelect: isDragging ? 'none' : 'auto',
        }}
        className="h-lg max-w-90% truncate"
      >
        {children}
      </div>
    ),
    modalRender: modal => (
      <div ref={modalRef}>
        {modal}
      </div>
    ),
    style: {
      top: position.y,
      left: position.x,
      transform: isDragging ? computedTransform && `translate(${computedTransform.x}px,${computedTransform.y}px)` : undefined,
      padding: 0,
      margin: 0,
    },
  }
}
