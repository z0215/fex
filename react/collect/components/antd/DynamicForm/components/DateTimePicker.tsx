import type { IDateTimePicker } from '../type'
import { defaultFormatMap } from './constant'

const DatePicker: React.FC<IDateTimePicker> = ({ options, ...rest }) => {
  return (
    <AntdForm.Item {...rest}>
      <AntdDatePicker showTime format={defaultFormatMap.DateTimePicker} {...options} />
    </AntdForm.Item>
  )
}

export default DatePicker
