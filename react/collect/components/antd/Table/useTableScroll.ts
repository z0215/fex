import type { TableProps } from 'antd'
import { type RefObject, useMemo } from 'react'
import { useHeight } from '~/shared'

export const useTableScroll = (parentRef: RefObject<HTMLElement>, enabled = true) => {
  const y = useHeight({
    parent: parentRef,
    top: () => parentRef.current?.querySelector('.ant-table-thead'),
    bottom: () => parentRef.current?.querySelector('.ant-table-pagination'),
  })
  return useMemo<TableProps['scroll']>(() => enabled ? { y } : undefined, [enabled, y])
}
