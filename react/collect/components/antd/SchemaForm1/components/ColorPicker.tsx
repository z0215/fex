import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { ColorPickerProps as AntdColorPickerProps } from 'antd'

export interface ColorPickerProps extends BasicSchemaFormItem<AntdColorPickerProps> {}

const ColorPicker: FC<ColorPickerProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdColorPicker {...componentProps} />
    </AntdForm.Item>
  )
}

export default ColorPicker
