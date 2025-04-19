import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { InputProps as AntdInputProps } from 'antd'

export interface InputProps extends BasicSchemaFormItem<AntdInputProps> {}

const Input: FC<InputProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdInput {...componentProps} />
    </AntdForm.Item>
  )
}

export default Input
