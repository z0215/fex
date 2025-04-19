import type { CascaderProps as AntdCascaderProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import useFetchOptions from '../useFetchOptions'

export interface CascaderProps extends BasicSchemaFormItem<AntdCascaderProps> {}

const Cascader: BFC<CascaderProps> = ({ formItemOptions, componentOptions, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdCascader options={data} loading={loading} disabled={loading} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Cascader
