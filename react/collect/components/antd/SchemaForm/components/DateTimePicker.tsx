import {
  DatePicker as ADatePicker,
  TimePicker as ATimePicker,
} from 'antd'
import dayjs from 'dayjs'
import type { GetProps } from '~/shared'

interface CommonDateProps {
  minDateText?: string
  minDateToday?: boolean
  maxDateText?: string
}
interface DateProps {
  today?: boolean
}

export const DatePicker = ({
  minDateText,
  minDateToday,
  maxDateText,
  ...props
}: GetProps<typeof ADatePicker> & CommonDateProps & DateProps) => {
  return (
    <ADatePicker
      minDate={minDateText ? dayjs(minDateText) : minDateToday ? dayjs() : undefined}
      maxDate={maxDateText ? dayjs(maxDateText) : undefined}
      {...props}
    />
  )
}
export const DateRangePicker = ({
  minDateText,
  minDateToday,
  maxDateText,
  ...props
}: GetProps<typeof ADatePicker.RangePicker> & CommonDateProps) => {
  return (
    <ADatePicker.RangePicker
      minDate={minDateText ? dayjs(minDateText) : minDateToday ? dayjs() : undefined}
      maxDate={maxDateText ? dayjs(maxDateText) : undefined}
      {...props}
    />
  )
}
export const TimePicker = ({
  minDateText,
  minDateToday,
  maxDateText,
  ...props
}: GetProps<typeof ATimePicker> & CommonDateProps & DateProps) => {
  return (
    <ATimePicker
      minDate={minDateText ? dayjs(minDateText) : minDateToday ? dayjs() : undefined}
      maxDate={maxDateText ? dayjs(maxDateText) : undefined}
      {...props}
    />
  )
}
export const TimeRangePicker = ({
  minDateText,
  minDateToday,
  maxDateText,
  ...props
}: GetProps<typeof ATimePicker.RangePicker> & CommonDateProps) => {
  return (
    <ATimePicker.RangePicker
      minDate={minDateText ? dayjs(minDateText) : minDateToday ? dayjs() : undefined}
      maxDate={maxDateText ? dayjs(maxDateText) : undefined}
      {...props}
    />
  )
}
