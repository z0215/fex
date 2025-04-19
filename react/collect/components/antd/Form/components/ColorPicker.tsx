import type { ColorPickerProps as AntdColorPickerProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'

export interface ColorPickerProps extends BasicSchemaFormItem<AntdColorPickerProps> {}

const ColorPicker: BFC<ColorPickerProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdColorPicker {...componentOptions} />
    </AntdForm.Item>
  )
}

export default ColorPicker
