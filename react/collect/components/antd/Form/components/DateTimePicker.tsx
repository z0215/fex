import type { DatePickerProps as AntdDatePickerProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import { datePickerFormatMap } from '../SchemaFormItem'

export interface DateTimePickerProps extends BasicSchemaFormItem<AntdDatePickerProps> {}

const DateTimePicker: BFC<DateTimePickerProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdDatePicker
        format={datePickerFormatMap.DateTimePicker}
        {...(componentOptions as any)}
        showTime
      />
    </AntdForm.Item>
  )
}

export default DateTimePicker
