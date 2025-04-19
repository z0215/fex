import type { IOption, IRemoteRequestConfig, IRemoteResponse } from '../type'

const buildQueryString = (params: Record<string, any>) => {
  return _entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

export const useOptions = (options: Array<IOption> | IRemoteRequestConfig) => {
  const getOptions = useMemoizedFn(async () => {
    if (Array.isArray(options)) {
      return options
    }
    const { url, method, params, data: postData } = options
    const fetchUrl = params ? `${url}?${buildQueryString(params)}` : url
    const data: IRemoteResponse = await fetch(fetchUrl, {
      method,
      body: JSON.stringify(postData),
    }).then((res) => res.json())
    return data?.data ?? []
  })
  const { loading, data } = useRequest(getOptions, {
    refreshDeps: [options],
  })
  return {
    loading,
    data,
  }
}
