import type { TimeRangePickerProps as AntdTimeRangePickerProps } from 'antd/es/time-picker'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import { dateRangePickerFormatMap } from '../SchemaFormItem'

export interface TimeRangePickerProps extends BasicSchemaFormItem<AntdTimeRangePickerProps> {}

const TimeRangePicker: BFC<TimeRangePickerProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdTimePicker.RangePicker
        format={dateRangePickerFormatMap.TimeRangePicker}
        {...componentOptions}
      />
    </AntdForm.Item>
  )
}

export default TimeRangePicker
