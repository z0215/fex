import type { InputNumberProps as AntdInputNumberProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'

export interface InputNumberProps extends BasicSchemaFormItem<AntdInputNumberProps> {}

const InputNumber: BFC<InputNumberProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdInputNumber {...componentOptions} />
    </AntdForm.Item>
  )
}

export default InputNumber
