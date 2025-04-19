/**
 * @example
 * group([1, 2, 3, 4], n => n % 2 === 0 ? 'even' : 'odd') // => { even: [2, 4], odd: [1, 3] }
 */
export const group = <T, Key extends string | number | symbol>(
  arr: T[],
  iterator: (item: T) => Key,
) => {
  return arr.reduce<{ [K in Key]?: T[] }>(
    (acc, item) => {
      const groupKey = iterator(item)
      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(item)
      return acc
    },
    {},
  )
}
