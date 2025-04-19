import type { FC } from 'react'
import { BasicSchemaFormItem, datePickerFormatMap } from './SchemaFormItem'
import type { DatePickerProps as AntdDatePickerProps } from 'antd'

export interface DateTimePickerProps extends BasicSchemaFormItem<AntdDatePickerProps> {}

const DateTimePicker: FC<DateTimePickerProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdDatePicker
        format={datePickerFormatMap.DateTimePicker}
        {...(componentProps as any)}
        showTime
      />
    </AntdForm.Item>
  )
}

export default DateTimePicker
