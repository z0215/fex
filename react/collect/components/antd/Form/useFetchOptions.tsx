import axios from 'axios'

export interface BaseOptionType {
  label: string
  value: string
  [name: string]: any
}

export interface FetchOptions {
  url: string
  method: 'get' | 'post'
  params?: Record<string, any>
  data?: any
  keyMapping?: Record<string, string>
}

const fetchOptions = async ({ method, url, params, data, keyMapping }: FetchOptions) => {
  const { data: res } = await axios({
    method,
    url,
    params,
    data,
  })
  return (res?.data || [])
    .map((item: any) => {
      if (typeof item === 'string') {
        return {
          label: item,
          value: item,
        }
      }
      if (_isObject(item) && keyMapping) {
        return Object.entries(item).reduce(
          (obj, [key, value]) => {
            const newKey = keyMapping[key]
            obj[newKey || key] = value
            return obj
          },
          {} as Record<string, any>,
        )
      }
      return item
    })
    .filter(Boolean) as BaseOptionType[]
}

const useFetchOptions = (
  options?: FetchOptions,
): { loading: boolean, data: BaseOptionType[] } => {
  const { data, isFetching } = useQuery({
    queryKey: [options],
    queryFn: () => fetchOptions(options!),
    refetchOnWindowFocus: false,
    enabled: Boolean(options),
  })

  if (!options) {
    return {
      loading: false,
      data: [],
    }
  }

  return {
    loading: isFetching,
    data: data || [],
  }
}

export default useFetchOptions
