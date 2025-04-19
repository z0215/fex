import type { ISwitch } from '../type'

const Switch: React.FC<ISwitch> = ({ options, ...rest }) => {
  return (
    <AntdForm.Item valuePropName={'checked'} {...rest}>
      <AntdSwitch {...options} />
    </AntdForm.Item>
  )
}

export default Switch
