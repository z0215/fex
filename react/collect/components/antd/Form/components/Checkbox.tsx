import type { CheckboxGroupProps as AntdCheckboxGroupProps } from 'antd/es/checkbox/Group'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import useFetchOptions from '../useFetchOptions'

export interface CheckboxProps extends BasicSchemaFormItem<AntdCheckboxGroupProps> {}

const Checkbox: BFC<CheckboxProps> = ({ formItemOptions, componentOptions, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdCheckbox.Group options={data} disabled={loading} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Checkbox
