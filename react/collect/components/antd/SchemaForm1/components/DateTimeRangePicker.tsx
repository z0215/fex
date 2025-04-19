import type { FC } from 'react'
import { BasicSchemaFormItem, dateRangePickerFormatMap } from './SchemaFormItem'
import type { RangePickerProps as AntdRangePickerProps } from 'antd/es/date-picker'

export interface DateTimeRangePickerProps extends BasicSchemaFormItem<AntdRangePickerProps> {}

const DateTimeRangePicker: FC<DateTimeRangePickerProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdDatePicker.RangePicker
        format={dateRangePickerFormatMap.DateTimeRangePicker}
        {...(componentProps as any)}
        showTime
      />
    </AntdForm.Item>
  )
}

export default DateTimeRangePicker
