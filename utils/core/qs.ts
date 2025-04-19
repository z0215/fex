import { tryit } from './function'
import { isArray, isUndefined } from './typed'

const parseJson = tryit((text: string) => JSON.parse(text) as Record<string, any> | string | boolean | number)

const stringifyJson = tryit((data: any) => JSON.stringify(data))

export const qs = {
  /**
   * @example
   * qs.parse('a=false&b=true&c=1&c=%222%22&d=%7B%22a%22%3A%221%22%2C%22b%22%3A2%7D&e=%22true%22&n=null')
   * {
   *   a: false,
   *   b: true,
   *   c: [1, '2'],
   *   d: { a: '1', b: 2 },
   *   e: 'true',
   *   n: null,
   *   u: undefined,
   * }
   */
  parse<T extends Record<string, any> = object>(search: string) {
    const decodeStr = decodeURIComponent(search)
    if (decodeStr === '' || decodeStr === '?')
      return {} as T

    const query: Record<string, any> = {}
    const searchStr = decodeStr.startsWith('?') ? decodeStr.slice(1) : decodeStr
    const searchParams = searchStr.split('&')
    for (const item of searchParams) {
      const [key, value] = item.includes('=') ? item.split('=') : [item, false]
      const [err, res] = parseJson(value.toString())
      if (key in query) {
        let currentValue = query[key]
        if (!isArray(currentValue)) {
          currentValue = query[key] = [currentValue]
        }
        currentValue.push(err ? value : res)
      }
      else {
        query[key] = err ? value : res
      }
    }

    return query as T
  },
  /**
   * @example
   * qs.stringify({
   *   a: false,
   *   b: true,
   *   c: [1, '2'],
   *   d: { a: '1', b: 2 },
   *   e: 'true',
   *   n: null,
   *   u: undefined,
   * }) // => 'a=false&b=true&c=1&c=%222%22&d=%7B%22a%22%3A%221%22%2C%22b%22%3A2%7D&e=%22true%22&n=null'
   */
  stringify(query: Record<string, any>) {
    let search = ''

    for (const [key, value] of Object.entries(query)) {
      if (isUndefined(value))
        break
      const k = encodeURIComponent(key)
      if (isArray(value)) {
        for (const item of value) {
          const [err, res] = stringifyJson(item)
          search += `${search.length ? '&' : ''}${k}=${encodeURIComponent(err ? item : res)}`
        }
      }
      else {
        const [err, res] = stringifyJson(value)
        search += `${search.length ? '&' : ''}${k}=${encodeURIComponent(err ? value : res)}`
      }
    }

    return search
  },
}
