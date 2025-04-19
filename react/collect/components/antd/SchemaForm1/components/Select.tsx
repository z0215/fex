import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { SelectProps as AntdSelectProps } from 'antd'
import { useFetchOptions, FetchOptions } from '../shared/useFetchOptions'

export interface SelectProps extends BasicSchemaFormItem<AntdSelectProps> {
  fetchOptions?: FetchOptions
}

const Select: FC<SelectProps> = ({ componentProps, fetchOptions, ...itemProps }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...itemProps}>
      <AntdSelect options={data} disabled={loading} loading={loading} {...componentProps} />
    </AntdForm.Item>
  )
}

export default Select
