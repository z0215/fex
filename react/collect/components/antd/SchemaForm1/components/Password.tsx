import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import { PasswordProps as AntdPasswordProps } from 'antd/es/input/Password'

export interface PasswordProps extends BasicSchemaFormItem<AntdPasswordProps> {}

const Password: FC<PasswordProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdInput.Password {...componentProps} />
    </AntdForm.Item>
  )
}

export default Password
