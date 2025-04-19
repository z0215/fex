import type { RangePickerProps as AntdRangePickerProps } from 'antd/es/date-picker'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import { dateRangePickerFormatMap } from '../SchemaFormItem'

export interface DateRangePickerProps extends BasicSchemaFormItem<AntdRangePickerProps> {}

const DateRangePicker: BFC<DateRangePickerProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdDatePicker.RangePicker
        format={dateRangePickerFormatMap.DateRangePicker}
        {...componentOptions}
      />
    </AntdForm.Item>
  )
}

export default DateRangePicker
