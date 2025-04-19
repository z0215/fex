const idCounter: Record<string, number> = {}

const defaultPrefix = '$uid$'

/**
 * @example
 * uid() // => '99'
 * uid('prefix') // => 'prefix99'
 */
export const uid = (prefix = defaultPrefix) => {
  if (!idCounter[prefix]) {
    idCounter[prefix] = 0
  }

  const id = ++idCounter[prefix]
  return prefix === defaultPrefix ? `${id}` : `${prefix}${id}`
}
