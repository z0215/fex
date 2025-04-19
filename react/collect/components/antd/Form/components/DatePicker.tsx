import type { DatePickerProps as AntdDatePickerProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import { datePickerFormatMap } from '../SchemaFormItem'

export interface DatePickerProps extends BasicSchemaFormItem<AntdDatePickerProps> {}

const DatePicker: BFC<DatePickerProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdDatePicker format={datePickerFormatMap.DatePicker} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default DatePicker
