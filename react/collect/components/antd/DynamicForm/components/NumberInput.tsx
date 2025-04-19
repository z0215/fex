import type { INumberInput } from '../type'

const NumberInput: React.FC<INumberInput> = ({ options, ...rest }) => {
  return (
    <AntdForm.Item {...rest}>
      <AntdInput style={{ width: '100%' }} {...options} />
    </AntdForm.Item>
  )
}

export default NumberInput
