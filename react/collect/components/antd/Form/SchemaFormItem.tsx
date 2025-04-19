import type { FormItemProps } from 'antd'
import type { FetchOptions } from './useFetchOptions'
import type { AutoCompleteProps } from './components/AutoComplete'
import AutoComplete from './components/AutoComplete'
import type { CascaderProps } from './components/Cascader'
import Cascader from './components/Cascader'
import type { CheckboxProps } from './components/Checkbox'
import Checkbox from './components/Checkbox'
import type { ColorPickerProps } from './components/ColorPicker'
import ColorPicker from './components/ColorPicker'
import type { DatePickerProps } from './components/DatePicker'
import DatePicker from './components/DatePicker'
import type { DateRangePickerProps } from './components/DateRangePicker'
import DateRangePicker from './components/DateRangePicker'
import type { DateTimePickerProps } from './components/DateTimePicker'
import DateTimePicker from './components/DateTimePicker'
import type { DateTimeRangePickerProps } from './components/DateTimeRangePicker'
import DateTimeRangePicker from './components/DateTimeRangePicker'
import type { InputProps } from './components/Input'
import Input from './components/Input'
import type { InputNumberProps } from './components/InputNumber'
import InputNumber from './components/InputNumber'
import type { MentionsProps } from './components/Mentions'
import Mentions from './components/Mentions'
import type { PasswordProps } from './components/Password'
import Password from './components/Password'
import type { RadioProps } from './components/Radio'
import Radio from './components/Radio'
import type { RateProps } from './components/Rate'
import Rate from './components/Rate'
import type { SelectProps } from './components/Select'
import Select from './components/Select'
import type { SliderProps } from './components/Slider'
import Slider from './components/Slider'
import type { SwitchProps } from './components/Switch'
import Switch from './components/Switch'
import type { TextAreaProps } from './components/TextArea'
import TextArea from './components/TextArea'
import type { TimePickerProps } from './components/TimePicker'
import TimePicker from './components/TimePicker'
import type { TimeRangePickerProps } from './components/TimeRangePicker'
import TimeRangePicker from './components/TimeRangePicker'
import type { TransferProps } from './components/Transfer'
import Transfer from './components/Transfer'
import type { TreeSelectProps } from './components/TreeSelect'
import TreeSelect from './components/TreeSelect'

export interface BasicSchemaFormItem<T = any> {
  formItemOptions?: FormItemProps
  componentOptions?: T
  fetchOptions?: FetchOptions
}

export const datePickerFormatMap = {
  DatePicker: 'YYYY-MM-DD',
  TimePicker: 'HH:mm',
  DateTimePicker: 'YYYY-MM-DD HH:mm',
}

export const dateRangePickerFormatMap = {
  DateRangePicker: datePickerFormatMap.DatePicker,
  TimeRangePicker: datePickerFormatMap.TimePicker,
  DateTimeRangePicker: datePickerFormatMap.DateTimePicker,
}

const componentsMap = {
  AutoComplete,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  DateTimeRangePicker,
  Input,
  InputNumber,
  Mentions,
  Password,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TextArea,
  TimePicker,
  TimeRangePicker,
  Transfer,
  TreeSelect,
}

export type ComponentType =
|({ type: 'AutoComplete' } & AutoCompleteProps)
|({ type: 'Cascader' } & CascaderProps)
|({ type: 'Checkbox' } & CheckboxProps)
|({ type: 'ColorPicker' } & ColorPickerProps)
|({ type: 'DatePicker' } & DatePickerProps)
|({ type: 'DateRangePicker' } & DateRangePickerProps)
|({ type: 'DateTimePicker' } & DateTimePickerProps)
|({ type: 'DateTimeRangePicker' } & DateTimeRangePickerProps)
|({ type: 'Input' } & InputProps)
|({ type: 'InputNumber' } & InputNumberProps)
|({ type: 'Mentions' } & MentionsProps)
|({ type: 'Password' } & PasswordProps)
|({ type: 'Radio' } & RadioProps)
|({ type: 'Rate' } & RateProps)
|({ type: 'Select' } & SelectProps)
|({ type: 'Slider' } & SliderProps)
|({ type: 'Switch' } & SwitchProps)
|({ type: 'TextArea' } & TextAreaProps)
|({ type: 'TimePicker' } & TimePickerProps)
|({ type: 'TimeRangePicker' } & TimeRangePickerProps)
|({ type: 'Transfer' } & TransferProps)
|({ type: 'TreeSelect' } & TreeSelectProps)

export type SchemaFormItemProps = ComponentType

const SchemaFormItem: BFC<SchemaFormItemProps> = ({ type, ...restProps }) => {
  const Component = useMemo(() => {
    return componentsMap[type]
  }, [type])

  return (
    <AntdAlert.ErrorBoundary
      message={`Something wrong when render component [${type}]`}
      description=""
    >
      <Component {...restProps as any} />
    </AntdAlert.ErrorBoundary>
  )
}

export default SchemaFormItem
