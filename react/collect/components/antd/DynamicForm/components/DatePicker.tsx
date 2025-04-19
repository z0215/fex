import type { IDatePicker } from '../type'
import { defaultFormatMap } from './constant'

const DatePicker: React.FC<IDatePicker> = ({ options, ...rest }) => {
  return (
    <AntdForm.Item {...rest}>
      <AntdDatePicker format={defaultFormatMap.DatePicker} {...options} />
    </AntdForm.Item>
  )
}

export default DatePicker
