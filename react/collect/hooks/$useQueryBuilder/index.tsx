import type { RefSelectProps } from 'antd/es/select/index'
import LRUCache from './LRUCache'
import './style.css'

interface CacheItem {
  type: TypeKey
  name: string
}
const cache = new LRUCache<CacheItem>()
interface CacheResultItem {
  key: string
  label: string
  type: 'group'
  children: { key: string, label: string, onClick: () => void }[]
}
const methods: Record<TypeKey, (item: any) => void> = {
  app: (item) => {
    // eslint-disable-next-line no-console
    console.log(`switch app`, item)
  },
  branch: (item) => {
    // eslint-disable-next-line no-console
    console.log(`switch branch`, item)
  },
  menu: (item) => {
    // eslint-disable-next-line no-console
    console.log(`go to menu`, item)
  },
}

const typeList = ['app', 'branch', 'menu'] as const
type TypeKey = typeof typeList[number]
const originSuggestions = typeList.map(item => ({ value: `@${item}:`, label: item }))

interface Options {
  type?: TypeKey
}

export const $useQueryBuilder = () => {
  const { modal } = AntdApp.useApp()
  const modalRef = useRef<ReturnType<typeof modal.confirm>>()
  const configRef = useRef<Options>()
  const modalConfigRef = useRef<AntdModalFuncProps>()
  const inputRef = useRef<RefSelectProps>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<AntdAutoCompleteProps['options']>([])
  const [cacheResults, setCacheResults] = useState<CacheResultItem[]>([])

  const [searchText, setSearchText] = useState('')
  const searchInfo = useMemo(() => {
    const [searchType, ...searchContent] = searchText.split(':')
    const type = searchType.replace(/^@/, '')
    const content = searchContent.join('')
    return {
      type,
      content,
    }
  }, [searchText])
  const [isSearch, setIsSearch] = useState(false)
  const { mutateAsync: search, data: searchResult, isPending: searchLoading } = useMutation({
    mutationKey: ['search'],
    mutationFn: () => $mock($mock.randomBoolean()
      ? $mock.getList(i => ({
        label: `Search${i}`,
        key: `Search${i}`,
      }), 3)
      : []),
    onSuccess() {
      setIsSearch(true)
    },
  })
  const localResults = useMemo(() => {
    if (isSearch && searchResult?.length) {
      return [
        {
          key: searchInfo.type,
          label: $capitalize(searchInfo.type),
          type: 'group',
          children: searchResult.map(item => ({ ...item, onClick: () => {
            const type = searchInfo.type as TypeKey
            methods[type](item)
            cache.put({ type, name: item.key })
            modalRef.current?.destroy()
          } })),
        },
      ]
    }
    const { type, content } = searchInfo
    const group = cacheResults.filter(item => item?.key.toLowerCase() === type.toLowerCase())
    const data = group.map((item) => {
      return {
        ...item,
        children: content
          ? item.children.filter(child => child.key.toLowerCase().includes(content.toLowerCase()))
          : item.children,
      }
    })
    return type ? data.filter(({ children }) => children.length) : cacheResults
  }, [isSearch, searchInfo, searchResult, cacheResults])

  const Result = useMemo(() => {
    if (localResults.length) {
      return (
        <AntdDropdown
          open
          menu={{ items: localResults as any[] }}
          getPopupContainer={() => containerRef.current ?? document.body}
        >
          <div ref={containerRef} className="query-builder-dropdown" />
        </AntdDropdown>
      )
    }
    if (isSearch) {
      return searchResult?.length
        ? (
          <AntdDropdown
            open
            menu={{ items: localResults as any[] }}
            getPopupContainer={() => containerRef.current ?? document.body}
          >
            <div ref={containerRef} className="query-builder-dropdown" />
          </AntdDropdown>
          )
        : <AntdEmpty image={AntdEmpty.PRESENTED_IMAGE_SIMPLE} />
    }
    return <AntdFlex align="center" justify="center" className="m-t-8px">Press enter to query data</AntdFlex>
  }, [isSearch, localResults, searchResult])

  useEffect(() => {
    setIsSearch(false)
  }, [searchText])

  const getConfig = useAhooksMemoizedFn<() => AntdModalFuncProps>(() => {
    const modalConfig = modalConfigRef.current || {}
    // 默认dropdown打开，现在最近常用（最近最长使用算法）的app和branch已经其他的搜索结果，用local storage缓存起来，提升用户体验，在输入关键字之后，根据关键字检索内容

    return {
      footer: null,
      icon: null,
      maskClosable: true,
      width: 700,
      content: (
        <div>
          <AntdAutoComplete
            ref={inputRef}
            allowClear
            defaultActiveFirstOption
            value={searchText}
            onChange={(text) => {
              setSearchText(text)
              if (!text || text.trim().endsWith(':') || !text.startsWith('@'))
                return setSuggestions([])

              const results = originSuggestions.filter(i => i.value.toLowerCase().includes(text.toLowerCase()))
              setSuggestions(results)
            }}
            onKeyDown={(e) => {
              if (e.code !== 'Enter')
                return

              const { type, content } = searchInfo
              if (!content || !typeList.includes(type as any))
                return
              // console.log('接口搜索', type, content)
              search()
            }}
            options={suggestions}
            className="w-full"
          >
            <AntdInput placeholder="Search" prefix={<AntdSearchOutlined />} />
          </AntdAutoComplete>
          <AntdSkeleton active loading={searchLoading}>
            {Result}
          </AntdSkeleton>
        </div>
      ),
      onCancel() {
        setSearchText('')
      },
      ...modalConfig,
    }
  })

  useAhooksUnmount(() => {
    modalRef.current?.destroy()
  })

  useEffect(() => {
    modalRef.current?.update(getConfig())
  }, [getConfig, searchText, searchLoading, cacheResults])

  return (options?: Options, modalConfig?: AntdModalFuncProps) => {
    configRef.current = options
    modalConfigRef.current = modalConfig

    modalRef.current = modal.confirm(getConfig())

    const { type } = configRef.current || {}
    if (type)
      setSearchText(`@${type}:`)

    const timer = setTimeout(() => {
      clearTimeout(timer)
      inputRef.current?.focus()
    })

    const list = cache.get() ?? []
    const group = _groupBy(list, 'type')
    const results = Object.entries(group).map<CacheResultItem>(([key, value]) => {
      return {
        key,
        label: $capitalize(key),
        type: 'group',
        children: value.map((i) => {
          return {
            key: i.name,
            label: i.name,
            onClick: () => {
              methods[i.type](i)
              cache.put(i)
              modalRef.current?.destroy()
            },
          }
        }),
      }
    })
    setCacheResults(results)
  }
}
