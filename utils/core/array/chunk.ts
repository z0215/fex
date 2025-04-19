/**
 * @example
 * chunk([1,2,3,4,5,6]) // => [[1,2],[3,4],[5,6]]
 * chunk([1,2,3,4,5,6],3) // => [[1,2,3],[4,5,6]]
 */
export const chunk = <T>(arr: T[], size = 2) => {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}
