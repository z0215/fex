import type { StringLiteralUnion } from '../../types'
import { qs } from './qs'
import {
  isObject,
  isUndefined,
} from './typed'

export class HTTPError extends Error {
  public response: Response
  public request: Request
  public options: HttpOptions

  constructor(response: Response, request: Request, options: HttpOptions) {
    const reason = response.status ? `status code ${response.status}` : 'an unknown error'

    super(`Request failed with ${reason}: ${request.method} ${request.url}`)

    this.name = 'HTTPError'
    this.response = response
    this.request = request
    this.options = options
  }
}

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface HttpInit extends Omit<RequestInit, 'method'> {
  timeout?: number
  baseUrl?: string
  interceptors?: {
    request?: (options: HttpOptions) => HttpOptions | Promise<HttpOptions>
    response?: (response: Response) => Response | Promise<Response>
  }
}

export interface HttpOptions extends Omit<HttpInit, 'hooks'> {
  url: string
  method?: StringLiteralUnion<HttpMethod>
  input?: string | URL | Request
  params?: any
  data?: any
}

/**
 * @example
 * const http = createHttp({
 *  timeout: 1000,
 *  baseUrl: 'base',
 *  interceptors: {
 *    request(options) {
 *      console.log(options)
 *      return options
 *    },
 *    response(response) {
 *      console.log(response)
 *      return response
 *    },
 *  },
 *})
 */
export const createHttp = (init?: HttpInit) => {
  const {
    timeout: initTimeout,
    baseUrl = '',
    interceptors,
    ...restInit
  } = init ?? {}

  return async (options: HttpOptions) => {
    const {
      url,
      input,
      params,
      data,
      timeout: userTimeout,
      baseUrl: userBaseUrl = '',
      ...restOptions
    } = options

    const controller = new AbortController()
    const timeout = userTimeout ?? initTimeout
    if (!isUndefined(timeout)) {
      const timer = setTimeout(() => {
        controller.abort()
        clearTimeout(timer)
      }, timeout)
    }

    const userRequest: HttpOptions = {
      url,
      input,
      params,
      data,
      baseUrl: `${baseUrl}${userBaseUrl}`,
      timeout,
      ...restInit,
      ...restOptions,
    }
    const interceptorsRequest = await interceptors?.request?.(userRequest)
    const {
      input: mergedInput,
      url: mergedUrl,
      baseUrl: mergedBaseUrl,
      ...restMergedOptions
    } = { ...userRequest, ...interceptorsRequest }
    const address = `${mergedBaseUrl}${mergedUrl}`
    const [path, searchParams = ''] = address.split('?')
    const query = qs.parse(searchParams)
    const search = qs.stringify({ ...query, ...params })

    const originResponse = await fetch(mergedInput ?? `${path}${search.length ? '?' : ''}${search}`, {
      signal: controller.signal,
      body: isObject(data) ? JSON.stringify(data) : data,
      ...restMergedOptions,
    })
    const res = await interceptors?.response?.(originResponse) ?? originResponse

    if (!res.ok) {
      throw new HTTPError(res, new Request(input ?? `${path}?${search}`, { ...restInit, ...restOptions }), options)
    }

    return res
  }
}

/**
 * @example
 * const res = await http({
 *  url: '/test',
 *  method: 'get',
 *  params: {
 *    a: 1,
 *  },
 * })
 * const data = await res.json()
 *
 * const res = await http({
 *  url: '/test',
 *  method: 'post',
 *  data: {
 *    b: 2,
 *  },
 * })
 * const data = await res.json()
 */
export const http = createHttp()
