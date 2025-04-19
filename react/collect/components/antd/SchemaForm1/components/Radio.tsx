import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { RadioGroupProps as AntdRadioGroupProps } from 'antd'
import { useFetchOptions, FetchOptions } from '../shared/useFetchOptions'

export interface RadioProps extends BasicSchemaFormItem<AntdRadioGroupProps> {
  fetchOptions?: FetchOptions
}

const Radio: FC<RadioProps> = ({ formItemProps, componentProps, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemProps}>
      <AntdRadio.Group options={data} disabled={loading} {...componentProps} />
    </AntdForm.Item>
  )
}

export default Radio
