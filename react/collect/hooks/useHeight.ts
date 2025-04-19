import { useState } from 'react'
import { getTarget, type Target } from './getTarget'
import { useMemoFn } from './useMemoFn'
import { useMutationObserver } from './useMutationObserver'
import { useResizeObserver } from './useResizeObserver'

const getFullHeight = (ele: Element) => {
  const { height } = ele.getBoundingClientRect()
  const computedStyle = getComputedStyle(ele)
  const marginTop = Number.parseFloat(computedStyle.marginTop)
  const marginBottom = Number.parseFloat(computedStyle.marginBottom)
  return height + marginTop + marginBottom
}

export interface UseRemainingHeightOptions {
  parent?: Target<Element>
  top?: Target<Element>
  bottom?: Target<Element>
}

/**
 * @example
 * const height = useHeight({
 *   parent: parentRef,
 *   top: () => document.querySelector('.ant-table-thead'),
 *   bottom: () => document.querySelector('.ant-table-pagination'),
 * })
 */
export const useHeight = (options?: UseRemainingHeightOptions) => {
  const { parent, top, bottom } = options ?? {}
  const [height, setHeight] = useState(0)

  const computedHeight = useMemoFn(() => {
    const element = getTarget(parent)
    if (!element)
      return

    const { top: parentTop, height: parentHeight } = element.getBoundingClientRect()
    const topBottom = getTarget(top)?.getBoundingClientRect().bottom ?? 0
    const bottomDom = getTarget(bottom)
    const bottomHeight = bottomDom ? getFullHeight(bottomDom) : 0
    const height = parentHeight - (topBottom - parentTop) - bottomHeight
    setHeight(height)
  })

  useResizeObserver({
    target: parent,
    onChange: computedHeight,
  })

  useResizeObserver({
    target: top,
    onChange: computedHeight,
  })

  useResizeObserver({
    target: bottom,
    onChange: computedHeight,
  })

  useMutationObserver({
    target: parent,
    onChange: computedHeight,
    attributes: true,
    childList: true,
    subtree: true,
  })

  return height
}
