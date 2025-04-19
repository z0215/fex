import type { FC } from 'react'
import { BasicSchemaFormItem, datePickerFormatMap } from './SchemaFormItem'
import type { DatePickerProps as AntdDatePickerProps } from 'antd'

export interface DatePickerProps extends BasicSchemaFormItem<AntdDatePickerProps> {}

const DatePicker: FC<DatePickerProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdDatePicker format={datePickerFormatMap.DatePicker} {...componentProps} />
    </AntdForm.Item>
  )
}

export default DatePicker
