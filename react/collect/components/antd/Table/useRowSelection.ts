import type { TableProps } from 'antd'
import type { Key } from 'react'
import { useMemo, useState } from 'react'
import { useMemoFn } from '~/shared'

export const useRowSelection = <T>(enabled?: boolean) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const rowSelection = useMemo<TableProps<T>['rowSelection']>(() => ({
    selectedRowKeys,
    onChange(selectedRowKeys, selectedRows) {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }), [selectedRowKeys])
  const clear = useMemoFn(() => {
    setSelectedRowKeys([])
    setSelectedRows([])
  })
  return useMemo(() => ({
    rowSelection: enabled ? rowSelection : undefined,
    selectedRowKeys,
    selectedRows,
    clear,
  }), [clear, enabled, rowSelection, selectedRowKeys, selectedRows])
}
