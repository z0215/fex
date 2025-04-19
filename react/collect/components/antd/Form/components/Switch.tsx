import type { SwitchProps as AntdSwitchProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'

export interface SwitchProps extends BasicSchemaFormItem<AntdSwitchProps> {}

const Switch: BFC<SwitchProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item valuePropName="checked" {...formItemOptions}>
      <AntdSwitch {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Switch
