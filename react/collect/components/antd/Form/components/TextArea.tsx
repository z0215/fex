import type { TextAreaProps as AntdTextAreaProps } from 'antd/es/input/TextArea'
import type { BasicSchemaFormItem } from '../SchemaFormItem'

export interface TextAreaProps extends BasicSchemaFormItem<AntdTextAreaProps> {}

const TextArea: BFC<TextAreaProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdInput.TextArea {...componentOptions} />
    </AntdForm.Item>
  )
}

export default TextArea
