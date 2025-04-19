import type { TableProps as ATableProps } from 'antd'
import type { SizeType } from 'antd/es/config-provider/SizeContext'
import type { SortOrder } from 'antd/es/table/interface'
import type { Key, ReactNode } from 'react'
import type { ActionsType } from './useActionColumns'
import { useQuery } from '@tanstack/react-query'
import { Table as ATable, Button, Flex, Form, Tooltip } from 'antd'
import { produce } from 'immer'
import { isValidElement, useId, useMemo, useRef, useState } from 'react'
import { Icon, isArray, useMemoFn } from '~/shared'
import { ColumnsPicker } from './ColumnsPicker'
import { SizePicker } from './SizePicker'
import { useActionColumns } from './useActionColumns'
import { usePagination } from './usePagination'
import { useRowSelection } from './useRowSelection'
import { useTableScroll } from './useTableScroll'
import { useTableSize } from './useTableSize'
import './style.css'

interface RequestPayload<F> {
  pagination?: {
    pageSize?: number
    pageNum?: number
  }
  sorter?: {
    field?: string
    order?: SortOrder
  }
  search?: F
}

export interface TableProps<T, F> extends ATableProps<T> {
  searchBar?: (payload: { size: SizeType }) => ReactNode
  renderSearchBar?: (payload: { size: SizeType }) => ReactNode
  toolBar?: (payload: { size: SizeType, selectedRowKeys: Key[], selectedRows: T[] }) => ReactNode
  renderToolBar?: (payload: { size: SizeType }) => ReactNode
  actions?: ActionsType<T>
  request?: (payload: RequestPayload<F>) => Promise<{ data: T[] | undefined, total?: number }>
  batch?: boolean
  fullHeight?: boolean
  persistencePagination?: boolean
  intervel?: number
}

export const Table = <T, F>({
  searchBar,
  renderSearchBar,
  toolBar,
  renderToolBar,
  actions,
  request,
  batch,
  fullHeight,
  persistencePagination,
  intervel,
  size: defaultSize = 'middle',
  columns,
  ...props
}: TableProps<T, F>) => {
  const id = useId()
  const [form] = Form.useForm<F>()
  const parentRef = useRef<HTMLElement>(null)
  const scroll = useTableScroll(parentRef, fullHeight)
  const { rowSelection, clear, selectedRowKeys, selectedRows } = useRowSelection<T>(batch)
  const actionColumns = useActionColumns(columns, actions)
  const [size, setSize] = useTableSize(id, defaultSize)
  const [requestPayload, setRequestPayload] = useState<RequestPayload<F>>({})
  const { refetch, data, isFetching } = useQuery({
    queryKey: [requestPayload],
    queryFn: () => request?.(requestPayload),
  })
  const pagination = usePagination({
    enabled: persistencePagination,
    total: data?.total ?? data?.data?.length,
  })
  const refresh = useMemoFn(() => {
    refetch()
    clear()
  })

  const childrenLength = useMemo(() => {
    const content = searchBar?.({ size })
    const isElement = isValidElement(content)
    if (!isElement)
      return 0

    if (!content.props.children)
      return 0

    if ('length' in content.props.children)
      return content.props.children.length

    return 1
  }, [searchBar, size])

  return (
    <Flex ref={parentRef} vertical className="h-full gap-base">
      <Flex justify="space-between" className="gap-base">
        <Flex className="gap-base">
          {renderSearchBar?.({ size }) ?? (
            <Form form={form} layout="inline" size={size} className="search-form">
              {searchBar?.({ size })}
              {childrenLength > 1 && (
                <Form.Item>
                  <Button
                    onClick={() => {
                      form.resetFields()
                      const values = form.getFieldsValue()
                      setRequestPayload(produce((draft) => {
                        draft.search = values as any
                        draft.pagination = {
                          pageNum: 1,
                        }
                      }))
                    }}
                  >
                    Reset
                  </Button>
                </Form.Item>
              )}
              {childrenLength > 0 && (
                <Form.Item>
                  <Button
                    type="primary"
                    icon={<Icon type="Search" />}
                    onClick={() => {
                      const values = form.getFieldsValue()
                      setRequestPayload(produce((draft) => {
                        draft.search = values as any
                        draft.pagination = {
                          pageNum: 1,
                        }
                      }))
                    }}
                  >
                    Search
                  </Button>
                </Form.Item>
              )}
            </Form>
          )}
        </Flex>
        <Flex className="gap-xs">
          {renderToolBar?.({ size }) ?? (
            <>
              {toolBar?.({ size, selectedRowKeys, selectedRows })}
              <Tooltip title="Refresh">
                <Button type="text" icon={<Icon type="Refresh" />} loading={isFetching} onClick={refresh} size={size} />
              </Tooltip>
              <SizePicker size={size} onChange={setSize} />
              <ColumnsPicker size={size} />
            </>
          )}
        </Flex>
      </Flex>

      <ATable
        rowKey="id"
        bordered
        loading={isFetching}
        dataSource={data?.data}
        pagination={pagination}
        scroll={scroll}
        rowSelection={rowSelection}
        {...props}
        size={size}
        columns={actionColumns}
        onChange={(...args) => {
          const [pagination, _filters, sorter] = args
          if (!isArray(sorter)) {
            setRequestPayload(produce((draft) => {
              draft.sorter = {
                order: sorter.order,
                field: sorter.field as string,
              }
            }))
          }
          setRequestPayload(produce((draft) => {
            draft.pagination = {
              pageSize: pagination.pageSize,
              pageNum: pagination.current,
            }
          }))
          props.onChange?.(...args)
        }}
      />
    </Flex>
  )
}
