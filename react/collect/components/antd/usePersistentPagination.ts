import type { PaginationProps } from 'antd'
import { useSearchParams } from 'react-router-dom'

/**
 * @example
 * const pagination = usePersistentPagination()
 * <Table pagination={pagination} />
 * or
 * <Pagination {...pagination} total={100} />
 */
export const usePersistentPagination = (pageKey = 'page', pageSizeKey = 'pageSize'): PaginationProps => {
  const [params, setParams] = useSearchParams()
  const page = params.get(pageKey)
  const pageSize = params.get(pageSizeKey)
  return {
    defaultCurrent: page ? Number.parseInt(page) : undefined,
    defaultPageSize: pageSize ? Number.parseInt(pageSize) : undefined,
    onChange(page, pageSize) {
      setParams({ [pageKey]: `${page}`, [pageSizeKey]: `${pageSize}` })
    },
  }
}
