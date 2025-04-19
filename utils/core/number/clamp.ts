/**
 * @example
 * clamp(3, 1, 5) // => 3
 * clamp(3, 5, 10) // => 5
 * clamp(8, 5, 10) // => 8
 * clamp(13, 5, 10) // => 10
 */
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))
