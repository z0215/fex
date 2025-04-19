import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { TextAreaProps as AntdTextAreaProps } from 'antd/es/input/TextArea'

export interface TextAreaProps extends BasicSchemaFormItem<AntdTextAreaProps> {}

const TextArea: FC<TextAreaProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdInput.TextArea {...componentProps} />
    </AntdForm.Item>
  )
}

export default TextArea
