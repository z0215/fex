import type { TreeSelectProps as AntdTreeSelectProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import useFetchOptions from '../useFetchOptions'

export interface TreeSelectProps extends BasicSchemaFormItem<AntdTreeSelectProps> {}

const TreeSelect: BFC<TreeSelectProps> = ({ formItemOptions, componentOptions, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdTreeSelect treeData={data} loading={loading} disabled={loading} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default TreeSelect
