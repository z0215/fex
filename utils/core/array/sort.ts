/**
 * @example
 * sort([4, 1, 6, 2]) // => [1, 2, 4, 6]
 * sort([4, 1, 6, 2], Number, true) // => [6, 4, 2, 1]
 * sort([{ id: 4 }, { id: 1 }, { id: 6 }, { id: 2 }], item => item.id) // => [{ id: 1 }, { id: 2 }, { id: 4 }, { id: 6 }]
 * sort([{ id: 4 }, { id: 1 }, { id: 6 }, { id: 2 }], item => item.id, true) // => [{ id: 6 }, { id: 4 }, { id: 2 }, { id: 1 }]
 */
export const sort = <T>(
  arr: T[],
  iterator?: (item: T) => number,
  desc = false,
) => {
  return arr.toSorted(
    iterator
      ? (a: T, b: T) => desc
          ? iterator(b) - iterator(a)
          : iterator(a) - iterator(b)
      : undefined,
  )
}
