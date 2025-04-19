/**
 * @example
 * random(1, 10) // => Random 1-10
 */
export const random = (min: number, max: number) => Math.floor(Math.random() * (max + 1 - min) + min)
