import type { FC } from 'react'
import { BasicSchemaFormItem, dateRangePickerFormatMap } from './SchemaFormItem'
import type { RangePickerProps as AntdRangePickerProps } from 'antd/es/date-picker'

export interface DateRangePickerProps extends BasicSchemaFormItem<AntdRangePickerProps> {}

const DateRangePicker: FC<DateRangePickerProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdDatePicker.RangePicker
        format={dateRangePickerFormatMap.DateRangePicker}
        {...componentProps}
      />
    </AntdForm.Item>
  )
}

export default DateRangePicker
