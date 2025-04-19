import type { SliderSingleProps as AntdSliderProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'

export interface SliderProps extends BasicSchemaFormItem<AntdSliderProps> {}

const Slider: BFC<SliderProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdSlider {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Slider
