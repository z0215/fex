import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { SwitchProps as AntdSwitchProps } from 'antd'

export interface SwitchProps extends BasicSchemaFormItem<AntdSwitchProps> {}

const Switch: FC<SwitchProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item valuePropName="checked" {...formItemProps}>
      <AntdSwitch {...componentProps} />
    </AntdForm.Item>
  )
}

export default Switch
