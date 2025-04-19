import type { ItemType, MenuItemType } from 'antd/es/menu/interface'
import type { ColumnsType, ColumnType } from 'antd/es/table'
import type { Key, ReactNode } from 'react'
import { Flex } from 'antd'
import { useMemo } from 'react'
import { camelCase, isString } from '~/shared'
import { Dropdown } from '../Dropdown'

export interface ActionsType<T> extends ColumnType<T> {
  actionRender?: (record: T) => ReactNode
  more?: (record: T) => Omit<ItemType, 'key'> & { key?: Key }[]
}

export const useActionColumns = <T,>(columns?: ColumnsType<T>, actions?: ActionsType<T>) => {
  return useMemo(() => {
    if (!columns)
      return []

    const internalColumns = columns.map<ColumnType<T>>((column, index) => {
      const col = column as ColumnType<T>
      const titleString = isString(col.title) ? col.title : undefined
      const defaultKey = titleString ? camelCase(titleString) : index
      return {
        ...col,
        dataIndex: col.dataIndex ?? defaultKey,
        key: col.key ?? defaultKey,
      }
    })

    if (!actions)
      return internalColumns

    const { actionRender, more, ...options } = actions

    return internalColumns.concat({
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render(_, record) {
        const items = more?.(record).map((item, index) => {
          const i = item as MenuItemType
          const labelString = isString(i.label) ? i.label : undefined
          return {
            ...item,
            key: item.key ?? (labelString ? camelCase(labelString) : index),
          }
        })
        return (
          <Flex align="center" className="actions gap-xs">
            {actionRender?.(record)}
            <Dropdown menu={{ items }} />
          </Flex>
        )
      },
      ...options,
    })
  }, [actions, columns])
}
