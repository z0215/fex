import { isBoolean } from '../../utils'

export interface CookieOptions {
  domain?: string
  path?: string
  expires?: number | string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

/**
 * @example
 * const cookie = createCookie({
 *  domain: 'localhost',
 *  path: '/',
 *  expires: 1,
 *  secure: true,
 *  sameSite: 'strict',
 *})
 */
export const createCookie = (options?: CookieOptions) => {
  const { ...attributes } = options ?? {}
  const { read, write } = {
    read: (v: string) => decodeURIComponent(v),
    write: (v: string) => encodeURIComponent(v),
  }

  const formatExpires = (expires: number | string) => {
    if (typeof expires === 'string')
      return expires

    if (expires === Infinity)
      return 'Fri, 31 Dec 9999 23:59:59 GMT'

    const day = 1000 * 60 * 60 * 24
    return new Date(Date.now() + expires * day).toUTCString()
  }

  const get = (key: string) => {
    const cookies = document.cookie.split('; ')
    for (const item of cookies) {
      const [k, v] = item.split('=')
      if (key === decodeURIComponent(k)) {
        return read(v) as string
      }
    }
  }

  const set = (key: string, value: string, options?: CookieOptions) => {
    const attr = Object.entries({ ...attributes, ...options }).reduce((acc, [key, value]) => {
      if (isBoolean(value)) {
        acc += `; ${key}`
        return acc
      }
      const map: Record<string, string> = {
        secure: value ? key : '',
        expires: `${key}=${formatExpires(value)}`,
      }
      acc += `; ${map[key] ?? `${key}=${value}`}`
      return acc
    }, '')
    document.cookie = `${encodeURIComponent(key)}=${write(value)}${attr}`
  }

  const remove = (key: string) => {
    set(key, '', { expires: -1 })
  }

  const clear = () => {
    const cookies = document.cookie.split('; ')
    for (const item of cookies) {
      const [k] = item.split('=')
      remove(k)
    }
  }

  return {
    get,
    set,
    remove,
    clear,
  }
}
