type ItemSize = number | ((index: number) => number)

export interface VirtualListBaseOptions<T> {
/**
 * the extra buffer items outside of the view area
 *
 * @default 5
 */
  overscan?: number
  onChange?: (info: { list: T[], height: number, marginTop: number }) => void
  data: T[]
}

export interface VirtualListHorizontalOptions<T> extends VirtualListBaseOptions<T> {
  /**
   * item width, accept a pixel value or a function that returns the width
   */
  itemWidth: ItemSize
}
export interface VirtualListVerticalOptions<T> extends VirtualListBaseOptions<T> {
  /**
   * item width, accept a pixel value or a function that returns the width
   */
  itemHeight: ItemSize
}

export type VirtualListOptions<T> = VirtualListHorizontalOptions<T> | VirtualListVerticalOptions<T>

/**
 * @example
 * const { dispose, scrollTo } = virtualList(containerEle, {
 *   data,
 *   itemHeight: 30,
 *   onChange({ list, height, marginTop }) {
 *     // list => Render list
 *     // height => Wrapper height
 *     // marginTop => Wrapper marginTop
 *   },
 * })
 */
export const virtualList = <T>(container: HTMLElement, options: VirtualListOptions<T>) => {
  const { overscan = 5, data, onChange } = options
  const isVertical = 'itemHeight' in options
  const itemSize = 'itemWidth' in options ? options.itemWidth : options.itemHeight
  let state = {
    start: 0,
    end: 0,
  }
  const getSize = (length: number) => {
    if (typeof itemSize === 'number')
      return length * itemSize

    return data.slice(0, length).reduce((sum, _, i) => sum + itemSize(i), 0)
  }
  const getOffset = (scrollDirection: number) => {
    if (typeof itemSize === 'number')
      return Math.floor(scrollDirection / itemSize) + 1

    let sum = 0
    let offset = 0

    for (let i = 0; i < data.length; i++) {
      const size = itemSize(i)
      sum += size
      if (sum >= scrollDirection) {
        offset = i
        break
      }
    }
    return offset + 1
  }
  const getViewCapacity = (containerSize: number) => {
    if (typeof itemSize === 'number')
      return Math.ceil(containerSize / itemSize)

    const { start = 0 } = state
    let sum = 0
    let capacity = 0
    for (let i = start; i < data.length; i++) {
      const size = itemSize(i)
      sum += size
      capacity = i
      if (sum > containerSize)
        break
    }
    return capacity - start
  }
  const calculateRange = () => {
    const offset = getOffset(isVertical ? container.scrollTop : container.scrollLeft)
    const viewCapacity = getViewCapacity(isVertical ? container.clientHeight : container.clientWidth)
    const from = offset - overscan
    const to = offset + viewCapacity + overscan
    state = {
      start: from < 0 ? 0 : from,
      end: to > data.length
        ? data.length
        : to,
    }

    onChange?.({
      list: data.slice(state.start, state.end),
      height: getSize(data.length) - getSize(state.start) - getSize(overscan),
      marginTop: getSize(state.start),
    })
  }

  calculateRange()

  container.addEventListener('scroll', calculateRange)
  const ob = new ResizeObserver(calculateRange)
  ob.observe(container)

  return {
    scrollTo: (index: number) => {
      container[isVertical ? 'scrollTop' : 'scrollLeft'] = getSize(index)
      calculateRange()
    },
    dispose: () => {
      container.removeEventListener('scroll', calculateRange)
      ob.unobserve(container)
    },
  }
}
