import type { ITimePicker } from '../type'
import { defaultFormatMap } from './constant'

const TimePicker: React.FC<ITimePicker> = ({ options, ...rest }) => {
  return (
    <AntdForm.Item {...rest}>
      <AntdTimePicker format={defaultFormatMap.TimePicker} {...options} />
    </AntdForm.Item>
  )
}

export default TimePicker
