import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import { CheckboxGroupProps as AntdCheckboxGroupProps } from 'antd/es/checkbox/Group'
import { useFetchOptions, FetchOptions } from '../shared/useFetchOptions'

export interface CheckboxProps extends BasicSchemaFormItem<AntdCheckboxGroupProps> {
  fetchOptions?: FetchOptions
}

const Checkbox: FC<CheckboxProps> = ({ formItemProps, componentProps, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemProps}>
      <AntdCheckbox.Group options={data} disabled={loading} {...componentProps} />
    </AntdForm.Item>
  )
}

export default Checkbox
