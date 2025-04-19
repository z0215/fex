import type { PaginationProps } from 'antd'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface UsePaginationOptions extends Omit<PaginationProps, 'defaultCurrent' | 'defaultPageSize'> {
  /**
   * @default page
   */
  pageKey?: string
  /**
   * @default pageSize
   */
  pageSizeKey?: string
  /**
   * @default 1
   */
  defaultCurrent?: PaginationProps['defaultCurrent']
  /**
   * @default 20
   */
  defaultPageSize?: PaginationProps['defaultPageSize']
  /**
   * @default true
   */
  enabled?: boolean
}

/**
 * @example
 * const pagination = usePagination()
 * <Table pagination={pagination} />
 * or
 * <Pagination {...pagination} total={100} />
 */
export const usePagination = (options?: UsePaginationOptions) => {
  const {
    pageKey = 'page',
    pageSizeKey = 'pageSize',
    defaultCurrent = 1,
    defaultPageSize = 20,
    enabled = true,
    ...props
  } = options ?? {}
  const [params, setParams] = useSearchParams()
  const page = params.get(pageKey)
  const pageSize = params.get(pageSizeKey)
  return useMemo<PaginationProps | undefined>(() => {
    return enabled
      ? {
          current: page ? Number.parseInt(page) : defaultCurrent,
          pageSize: pageSize ? Number.parseInt(pageSize) : defaultPageSize,
          onChange(page, pageSize) {
            setParams({ [pageKey]: `${page}`, [pageSizeKey]: `${pageSize}` })
          },
          ...props,
        }
      : undefined
  }, [defaultCurrent, defaultPageSize, enabled, page, pageKey, pageSize, pageSizeKey, props, setParams])
}
