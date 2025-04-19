import type { DrawerProps as ADrawerProps } from 'antd'
import type { CSSProperties } from 'react'
import { useMemo, useRef, useState } from 'react'
import {
  isObject,
  isString,
  isUndefined,
  limit,
  useDraggable,
  useMemoFn,
} from '~/shared'

const getComputeMethod = (placement: Required<ADrawerProps>['placement']) => {
  switch (placement) {
    case 'right':
      return (width: number, x: number) => width - x
    case 'left':
      return (width: number, x: number) => width + x
    case 'bottom':
      return (height: number, y: number) => height - y
    case 'top':
      return (height: number, y: number) => height + y
    default:
      // eslint-disable-next-line no-case-declarations
      const exhaustiveCheck: never = placement
      return exhaustiveCheck
  }
}

interface Resizable {
  min?: number
  max?: number
}
const isResizable = (value: any): value is Resizable => isObject(value) && !isUndefined(value.min || value.max)
export interface UseDrawerOptions {
  /**
   * @default right
   */
  placement?: ADrawerProps['placement']
  /**
   * @default true
   */
  resizable?: boolean | Resizable
  width?: ADrawerProps['width']
  height?: ADrawerProps['height']
  open?: ADrawerProps['open']
}

export const useDrawer = (options?: UseDrawerOptions): ADrawerProps => {
  const {
    placement = 'right',
    resizable = true,
    width,
    height,
    open,
  } = options ?? {}
  const isHorizontal = useMemo(() => ['left', 'right'].includes(placement), [placement])
  const isVertical = useMemo(() => ['top', 'bottom'].includes(placement), [placement])
  const style = useMemo<CSSProperties | undefined>(() => {
    if (!resizable)
      return

    const baseStyle: CSSProperties = {
      position: 'absolute',
      userSelect: 'none',
    }
    if (isHorizontal) {
      return {
        ...baseStyle,
        height: '100%',
        width: 5,
        cursor: 'ew-resize',
        top: 0,
        [placement === 'left' ? 'right' : 'left']: 0,
      }
    }
    return {
      ...baseStyle,
      width: '100%',
      height: 5,
      cursor: 'ns-resize',
      left: 0,
      [placement === 'top' ? 'bottom' : 'top']: 0,
    }
  }, [isHorizontal, placement, resizable])
  const defaultSize = useMemo(() => {
    // Follow Antd
    const defaultSize = (isHorizontal ? window.innerWidth : window.innerHeight) * 0.3

    return {
      width: isHorizontal
        ? isString(width)
          ? Number.parseFloat(width)
          : (width ?? defaultSize)
        : 0,
      height: isVertical
        ? isString(height)
          ? Number.parseFloat(height)
          : (height ?? defaultSize)
        : 0,
    }
  }, [isHorizontal, isVertical, height, width])
  const [size, setSize] = useState(defaultSize)
  const calc = useMemoFn(getComputeMethod(placement))
  const restrictEdges = useMemoFn((value: number) => {
    const defaultMin = 0
    const defaultMax = isHorizontal ? window.innerWidth : window.innerHeight
    const { min = defaultMin, max = defaultMax } = isResizable(resizable) ? resizable : {}
    return limit(value, min, max)
  })
  const dragRef = useRef<HTMLDivElement>(null)
  const { transform, isDragging } = useDraggable({
    target: dragRef,
    onEnd({ transform }) {
      setSize(({ width, height }) => {
        return {
          width: isHorizontal ? restrictEdges(calc(width, transform.x)) : width,
          height: isVertical ? restrictEdges(calc(height, transform.y)) : height,
        }
      })
    },
    disabled: !resizable || !open,
  })

  return {
    footer: placement === 'top' ? <div ref={dragRef} style={style} /> : null,
    title: placement === 'bottom' ? <div ref={dragRef} style={style} /> : null,
    children: isHorizontal ? <div ref={dragRef} style={style} /> : null,
    width: isHorizontal && transform && isDragging ? restrictEdges(calc(size.width, transform.x)) : size.width,
    height: isVertical && transform && isDragging ? restrictEdges(calc(size.height, transform.y)) : size.height,
    styles: {
      body: { position: 'relative' },
      wrapper: {
        transition: isDragging ? 'unset' : undefined,
      },
      footer: {
        padding: 'unset',
      },
    },
  }
}
