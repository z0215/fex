import type { InputProps as AntdInputProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'

export interface InputProps extends BasicSchemaFormItem<AntdInputProps> {}

const Input: BFC<InputProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdInput {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Input
