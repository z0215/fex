import type { FC } from 'react'
import { BasicSchemaFormItem, datePickerFormatMap } from './SchemaFormItem'
import type { TimePickerProps as AntdTimePickerProps } from 'antd'

export interface TimePickerProps extends BasicSchemaFormItem<AntdTimePickerProps> {}

const TimePicker: FC<TimePickerProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdTimePicker format={datePickerFormatMap.TimePicker} {...componentProps} />
    </AntdForm.Item>
  )
}

export default TimePicker
