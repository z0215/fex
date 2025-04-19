import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { TreeSelectProps as AntdTreeSelectProps } from 'antd'
import { useFetchOptions, FetchOptions } from '../shared/useFetchOptions'

export interface TreeSelectProps extends BasicSchemaFormItem<AntdTreeSelectProps> {
  fetchOptions?: FetchOptions
}

const TreeSelect: FC<TreeSelectProps> = ({ formItemProps, componentProps, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemProps}>
      <AntdTreeSelect treeData={data} loading={loading} disabled={loading} {...componentProps} />
    </AntdForm.Item>
  )
}

export default TreeSelect
