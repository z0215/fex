export interface IBasicComponent {
  type: string
  disableExprMode?: boolean
  options: any
  // form item options
  name: string
  value: any
  label?: string
  required?: boolean
  // tooltip
  tooltip?: string
  help?: string
  // rule
  condition?: {
    key: string
    value: any
  }
}

export interface IRemoteRequestConfig {
  url: string
  method: 'get' | 'post'
  params?: any
  data?: any
}

export interface IOption {
  label: string
  value: any
}

export interface IRemoteResponse {
  success: boolean
  data: IOption[]
}

export interface IPureText extends IBasicComponent {
  type: 'PureText'
  options: {
    type?: 'success' | 'error' | 'warning' | 'info'
    displayType?: 'strong' | 'normal'
  }
}

export interface IInput extends IBasicComponent {
  type: 'Input'
  options: {
    placeholder?: string
  }
}

export interface ITextArea extends IBasicComponent {
  type: 'TextArea'
  options: {
    placeholder?: string
    rows?: number
  }
}

export interface INumberInput extends IBasicComponent {
  type: 'NumberInput'
  options: {
    placeholder?: string
  }
}

export interface IAutoComplete extends IBasicComponent {
  type: 'AutoComplete'
  options: {
    placeholder?: string
    options: Array<IOption> | IRemoteRequestConfig
  }
}

export interface ISelect extends IBasicComponent {
  type: 'Select'
  options: {
    placeholder?: string
    multiple?: boolean
    options: Array<IOption> | IRemoteRequestConfig
  }
}

export interface IRadio extends IBasicComponent {
  type: 'Radio'
  options: {
    options: Array<IOption> | IRemoteRequestConfig
  }
}

export interface ICheckbox extends IBasicComponent {
  type: 'Checkbox'
  options: {
    options: Array<IOption> | IRemoteRequestConfig
  }
}

export interface ISwitch extends IBasicComponent {
  type: 'Switch'
}

export interface IDatePicker extends IBasicComponent {
  type: 'DatePicker'
  options: {
    submitFormat?: string
    placeholder?: string
  }
}

export interface ITimePicker extends IBasicComponent {
  type: 'TimePicker'
  options: {
    submitFormat?: string
    placeholder?: string
  }
}

export interface IDateTimePicker extends IBasicComponent {
  type: 'DateTimePicker'
  options: {
    submitFormat?: string
    placeholder?: string
  }
}

export type BasicComponent =
  | IPureText
  | IInput
  | ITextArea
  | INumberInput
  | IAutoComplete
  | ISelect
  | IRadio
  | ISwitch
  | ICheckbox
  | IDatePicker
  | ITimePicker
  | IDateTimePicker
  | IArray

export interface IArray extends IBasicComponent {
  type: 'Array'
  options: {
    wording?: {
      addButtonWording?: string
    }
    children: BasicComponent[]
  }
}

export interface IBasicStep {
  label: string
  key: string
  options: {
    children: BasicComponent[]
  }
}

export interface IStep {
  type: 'Step'
  options: {
    children: IBasicStep[]
  }
}

export interface ICollapse {
  type: 'Collapse'
  label: string
  name?: string[] | string
  options: {
    children: BasicComponent[]
  }
}

interface ITabPanel {
  title: string
  children: BasicComponent[]
}

export interface ITab {
  type: 'Tab'
  name?: string | string[]
  options: {
    type?: 'card' | 'line'
    children: ITabPanel[]
  }
}

interface ICol {
  span: number
  children: BasicComponent[]
}

export interface IRow {
  type: 'Row'
  name?: string | string[]
  options: {
    cols: ICol[]
    gutter?: number | [number, number]
  }
}

export type LayoutComponents = IStep | ICollapse | ITab | IRow

export type AllComponents = BasicComponent | LayoutComponents

export type ComponentTypes = BasicComponent['type'] | LayoutComponents['type']

export interface RegisterRemoteComponentOptions {
  entry: string
  remoteName: string
  componentName: string
}

export type InternalNamePath = (string | number)[]
export type NamePath = string | number | InternalNamePath
export type StoreValue = any
export type Store = Record<string, StoreValue>
export interface Meta {
  touched: boolean
  validating: boolean
  errors: string[]
  warnings: string[]
  name: InternalNamePath
}
export interface InternalFieldData extends Meta {
  value: StoreValue
}
/**
 * Used by `setFields` config
 */
export interface FieldData extends Partial<Omit<InternalFieldData, 'name'>> {
  name: NamePath
}
