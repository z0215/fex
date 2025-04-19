import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { InputNumberProps as AntdInputNumberProps } from 'antd'

export interface InputNumberProps extends BasicSchemaFormItem<AntdInputNumberProps> {}

const InputNumber: FC<InputNumberProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdInputNumber {...componentProps} />
    </AntdForm.Item>
  )
}

export default InputNumber
