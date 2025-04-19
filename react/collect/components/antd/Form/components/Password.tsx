import type { PasswordProps as AntdPasswordProps } from 'antd/es/input/Password'
import type { BasicSchemaFormItem } from '../SchemaFormItem'

export interface PasswordProps extends BasicSchemaFormItem<AntdPasswordProps> {}

const Password: BFC<PasswordProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdInput.Password autoComplete="autocomplete" {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Password
