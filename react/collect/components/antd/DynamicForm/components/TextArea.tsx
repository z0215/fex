import type { ITextArea } from '../type'

const defaultOptions: ITextArea['options'] = {
  rows: 3,
}

const TextArea: React.FC<ITextArea> = ({ options, ...rest }) => {
  return (
    <AntdForm.Item {...rest}>
      <AntdInput.TextArea {...defaultOptions} {...options} />
    </AntdForm.Item>
  )
}

export default TextArea
