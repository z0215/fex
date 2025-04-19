import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { AlertProps as AntdAlertProps } from 'antd'

export interface AlertProps extends BasicSchemaFormItem<AntdAlertProps> {}

const Alert: FC<AlertProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdAlert {...componentProps} />
    </AntdForm.Item>
  )
}

export default Alert
