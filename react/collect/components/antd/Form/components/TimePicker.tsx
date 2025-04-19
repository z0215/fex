import type { TimePickerProps as AntdTimePickerProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import { datePickerFormatMap } from '../SchemaFormItem'

export interface TimePickerProps extends BasicSchemaFormItem<AntdTimePickerProps> {}

const TimePicker: BFC<TimePickerProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdTimePicker format={datePickerFormatMap.TimePicker} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default TimePicker
