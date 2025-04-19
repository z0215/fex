import type { IInput } from '../type'

const Input: React.FC<IInput> = ({ options, ...rest }) => {
  return (
    <AntdForm.Item {...rest}>
      <AntdInput {...options} />
    </AntdForm.Item>
  )
}

export default Input
