import type { RadioGroupProps as AntdRadioGroupProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import useFetchOptions from '../useFetchOptions'

export interface RadioProps extends BasicSchemaFormItem<AntdRadioGroupProps> {}

const Radio: BFC<RadioProps> = ({ formItemOptions, componentOptions, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdRadio.Group options={data} disabled={loading} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Radio
