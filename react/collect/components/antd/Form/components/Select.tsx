import type { SelectProps as AntdSelectProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import useFetchOptions from '../useFetchOptions'

export interface SelectProps extends BasicSchemaFormItem<AntdSelectProps> {}

const Select: BFC<SelectProps> = ({ formItemOptions, componentOptions, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdSelect options={data} disabled={loading} loading={loading} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Select
