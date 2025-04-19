import type { FC } from 'react'
import { BasicSchemaFormItem, dateRangePickerFormatMap } from './SchemaFormItem'
import type { TimeRangePickerProps as AntdTimeRangePickerProps } from 'antd/es/time-picker'

export interface TimeRangePickerProps extends BasicSchemaFormItem<AntdTimeRangePickerProps> {}

const TimeRangePicker: FC<TimeRangePickerProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdTimePicker.RangePicker
        format={dateRangePickerFormatMap.TimeRangePicker}
        {...componentProps}
      />
    </AntdForm.Item>
  )
}

export default TimeRangePicker
