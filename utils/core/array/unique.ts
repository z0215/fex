import { isEqual } from '../typed'

/**
 * @example
 * unique([1, 3, 5, 3, 6]) // => [1, 3, 5, 6]
 * unique([{ id: 1 }, { id: 1 }) // => [{ id: 1 }]
 * unique(unique([{ id: 1, age: 10 }, { id: 1, age: 18 }])) // => [{ id: 1, age: 10 }, { id: 1, age: 18 }]
 * unique(unique([{ id: 1, age: 10 }, { id: 1, age: 18 }], (a, b) => a.id === b.id)) // => [{ id: 1, age: 10 }]
 */
export const unique = <T>(arr: T[], equals: (item: T, value: T) => boolean = isEqual) => {
  const result: T[] = []
  outer:for (const item of arr) {
    for (const value of result) {
      if (equals(item, value)) {
        continue outer
      }
    }
    result.push(item)
  }
  return result
}
