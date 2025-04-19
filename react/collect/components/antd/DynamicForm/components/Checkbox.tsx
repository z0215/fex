import type { ICheckbox } from '../type'
import { useOptions } from './hooks'

const Checkbox: React.FC<ICheckbox> = ({ options, ...rest }) => {
  const { options: selectOptions, ...otherProps } = useMemo(() => {
    return options ?? {}
  }, [options])
  const { data, loading } = useOptions(selectOptions)
  return (
    <AntdForm.Item {...rest}>
      <AntdCheckbox.Group options={data} disabled={loading} {...otherProps} />
    </AntdForm.Item>
  )
}

export default Checkbox
