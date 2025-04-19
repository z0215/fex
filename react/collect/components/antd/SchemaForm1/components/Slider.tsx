import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { SliderSingleProps as AntdSliderProps } from 'antd'

export interface SliderProps extends BasicSchemaFormItem<AntdSliderProps> {}

const Slider: FC<SliderProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdSlider {...componentProps} />
    </AntdForm.Item>
  )
}

export default Slider
