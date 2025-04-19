import type { FC, Key } from 'react'
import type { FormItemProps } from 'antd'
import { FetchOptions } from '../shared/useFetchOptions'
import { SchemaFormContext } from '../shared/context'
import AutoComplete, { AutoCompleteProps } from './AutoComplete'
import Cascader, { CascaderProps } from './Cascader'
import Checkbox, { CheckboxProps } from './Checkbox'
import ColorPicker, { ColorPickerProps } from './ColorPicker'
import DatePicker, { DatePickerProps } from './DatePicker'
import DateTimePicker, { DateTimePickerProps } from './DateTimePicker'
import DateRangePicker, { DateRangePickerProps } from './DateRangePicker'
import DateTimeRangePicker, { DateTimeRangePickerProps } from './DateTimeRangePicker'
import Input, { InputProps } from './Input'
import Password, { PasswordProps } from './Password'
import TextArea, { TextAreaProps } from './TextArea'
import InputNumber, { InputNumberProps } from './InputNumber'
import Mentions, { MentionsProps } from './Mentions'
import Radio, { RadioProps } from './Radio'
import Rate, { RateProps } from './Rate'
import Select, { SelectProps } from './Select'
import Slider, { SliderProps } from './Slider'
import Switch, { SwitchProps } from './Switch'
import TimePicker, { TimePickerProps } from './TimePicker'
import TimeRangePicker, { TimeRangePickerProps } from './TimeRangePicker'
import TreeSelect, { TreeSelectProps } from './TreeSelect'
import Transfer, { TransferProps } from './Transfer'
import Alert, { AlertProps } from './Alert'
import List, { ListProps } from './List'
import Collapse, { CollapseProps } from './Collapse'

const componentsMap = {
  AutoComplete,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  DateTimePicker,
  DateRangePicker,
  DateTimeRangePicker,
  Input,
  Password,
  TextArea,
  InputNumber,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  TimeRangePicker,
  TreeSelect,
  Transfer,
  Alert,
  List,
  Collapse,
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

export const layoutComponents = ['Collapse', 'Tabs', 'Steps']

export type SchemaFormItemType =
  | ({
      type: 'AutoComplete'
    } & AutoCompleteProps)
  | ({
      type: 'Cascader'
    } & CascaderProps)
  | ({
      type: 'Checkbox'
    } & CheckboxProps)
  | ({
      type: 'ColorPicker'
    } & ColorPickerProps)
  | ({
      type: 'DatePicker'
    } & DatePickerProps)
  | ({
      type: 'DateTimePicker'
    } & DateTimePickerProps)
  | ({
      type: 'DateRangePicker'
    } & DateRangePickerProps)
  | ({
      type: 'DateTimeRangePicker'
    } & DateTimeRangePickerProps)
  | ({
      type: 'Input'
    } & InputProps)
  | ({
      type: 'Password'
    } & PasswordProps)
  | ({
      type: 'TextArea'
    } & TextAreaProps)
  | ({
      type: 'InputNumber'
    } & InputNumberProps)
  | ({
      type: 'Mentions'
    } & MentionsProps)
  | ({
      type: 'Radio'
    } & RadioProps)
  | ({
      type: 'Rate'
    } & RateProps)
  | ({
      type: 'Select'
    } & SelectProps)
  | ({
      type: 'Slider'
    } & SliderProps)
  | ({
      type: 'Switch'
    } & SwitchProps)
  | ({
      type: 'TimePicker'
    } & TimePickerProps)
  | ({
      type: 'TimeRangePicker'
    } & TimeRangePickerProps)
  | ({
      type: 'TreeSelect'
    } & TreeSelectProps)
  | ({
      type: 'Transfer'
    } & TransferProps)
  | ({
      type: 'Alert'
    } & AlertProps)
  | ({
      type: 'List'
    } & ListProps)
  | ({
      type: 'Collapse'
    } & CollapseProps)

export interface BasicSchemaFormItem<D> {
  formItemProps?: FormItemProps
  componentProps?: D
}

export type SchemaFormItemProps = SchemaFormItemType & {
  key?: Key
  fetchOptions?: FetchOptions
  items?: { formItems?: SchemaFormItemProps[]; [key: string]: any }[]
}

const SchemaFormItem: FC<SchemaFormItemProps> = ({ type, ...restProps }) => {
  const Component = useMemo(() => {
    return componentsMap[type]
  }, [type])

  const prefixPath = useContext(SchemaFormContext)
  const name = useMemo(() => {
    return [..._flattenDeep(prefixPath), ..._castArray(restProps?.formItemProps?.name)].filter(
      Boolean,
    )
  }, [prefixPath, restProps?.formItemProps?.name])

  return (
    <AntdAlert.ErrorBoundary
      message={`Something wrong when render component [${type}]`}
      description={''}
    >
      <Component
        {...(restProps as any)}
        formItemProps={{
          ...restProps?.formItemProps,
          name,
        }}
      />
    </AntdAlert.ErrorBoundary>
  )
}

export default SchemaFormItem
