import type { RangePickerProps as AntdRangePickerProps } from 'antd/es/date-picker'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import { dateRangePickerFormatMap } from '../SchemaFormItem'

export interface DateTimeRangePickerProps extends BasicSchemaFormItem<AntdRangePickerProps> {}

const DateTimeRangePicker: BFC<DateTimeRangePickerProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdDatePicker.RangePicker
        format={dateRangePickerFormatMap.DateTimeRangePicker}
        {...(componentOptions as any)}
        showTime
      />
    </AntdForm.Item>
  )
}

export default DateTimeRangePicker
