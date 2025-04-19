import type { FormItemProps } from 'antd'
import type { Color } from 'antd/es/color-picker'
import type { ComponentType as ReactComponentType } from 'react'
import {
  AutoComplete,
  Cascader,
  Checkbox,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TreeSelect,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { isArray, useMemoFn } from '~/shared'
import type { GetProps } from '~/shared'
import { Collapse } from './components/Collapse'
import { DatePicker, DateRangePicker, TimePicker, TimeRangePicker } from './components/DateTimePicker'
import { List } from './components/List'
import { PureText } from './components/PureText'
import { Tabs } from './components/Tabs'
import { Transfer } from './components/Transfer'

const components = {
  Input,
  TextArea: Input.TextArea,
  Number: InputNumber,
  Password: Input.Password,
  AutoComplete,
  Mentions,
  Select,
  Cascader,
  Checkbox: Checkbox.Group,
  Radio: Radio.Group,
  Switch,
  Rate,
  Slider,
  ColorPicker,
  TreeSelect,
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  Transfer,
  PureText,
  Collapse,
  Tabs,
  List,
}

export type ComponentType =
  | { type: 'Input', props?: GetProps<typeof components['Input']> }
  | { type: 'TextArea', props?: GetProps<typeof components['TextArea']> }
  | { type: 'Number', props?: GetProps<typeof components['Number']> }
  | { type: 'Password', props?: GetProps<typeof components['Password']> }
  | { type: 'AutoComplete', props?: GetProps<typeof components['AutoComplete']> }
  | { type: 'Mentions', props?: GetProps<typeof components['Mentions']> }
  | { type: 'Select', props?: GetProps<typeof components['Select']> }
  | { type: 'Cascader', props?: GetProps<typeof components['Cascader']> }
  | { type: 'Checkbox', props?: GetProps<typeof components['Checkbox']> }
  | { type: 'Radio', props?: GetProps<typeof components['Radio']> }
  | { type: 'Switch', props?: GetProps<typeof components['Switch']> }
  | { type: 'Rate', props?: GetProps<typeof components['Rate']> }
  | { type: 'Slider', props?: GetProps<typeof components['Slider']> }
  | { type: 'ColorPicker', props?: GetProps<typeof components['ColorPicker']> }
  | { type: 'TreeSelect', props?: GetProps<typeof components['TreeSelect']> }
  | { type: 'DatePicker', props?: GetProps<typeof components['DatePicker']> }
  | { type: 'DateRangePicker', props?: GetProps<typeof components['DateRangePicker']> }
  | { type: 'TimePicker', props?: GetProps<typeof components['TimePicker']> }
  | { type: 'TimeRangePicker', props?: GetProps<typeof components['TimeRangePicker']> }
  | { type: 'Transfer', props?: GetProps<typeof components['Transfer']> }
  | { type: 'PureText', props?: GetProps<typeof components['PureText']> }
  | { type: 'Collapse', props?: GetProps<typeof components['Collapse']> }
  | { type: 'Tabs', props?: GetProps<typeof components['Tabs']> }
  | { type: 'List', props?: GetProps<typeof components['List']> }

export type SchemaItem<T> = FormItemProps<T> & ComponentType

export const Item = <T,>({ type, props, ...options }: SchemaItem<T>) => {
  const Component = useMemo(() => components[type] as ReactComponentType<any>, [type])
  const getValueProps = useMemoFn((value: any) => {
    if (/^(?:Date|Time)/.test(type)) {
      if (!value) {
        return { value }
      }

      if (isArray(value)) {
        return { value: value.map(val => dayjs(val)) }
      }

      return { value: dayjs(value) }
    }
    return { value }
  })
  const normalize = useMemoFn((value: any) => {
    if (type === 'ColorPicker') {
      return (value as Color).toHexString()
    }
    if (/^(?:Date|Time)/.test(type)) {
      if (!value) {
        return value
      }

      if (isArray(value)) {
        return value.map(val => dayjs(val).format())
      }

      return dayjs(value).format()
    }
    return value
  })
  const initialValue = useMemo(() => {
    if (/^(?:Date|Time)/.test(type) && (props as any)?.today) {
      return dayjs().format()
    }
  }, [props, type])
  return (
    <Form.Item
      {...options}
      normalize={normalize}
      getValueProps={getValueProps}
      initialValue={initialValue}
    >
      <Component {...props} />
    </Form.Item>
  )
}
