import type { ISelect } from '../type'
import { useOptions } from './hooks'

const Select: React.FC<ISelect> = ({ options, ...rest }) => {
  const { options: selectOptions, ...otherProps } = useMemo(() => {
    return options ?? {}
  }, [options])
  const { data, loading } = useOptions(selectOptions)
  return (
    <AntdForm.Item {...rest}>
      <AntdSelect style={{ width: '100%' }} options={data} loading={loading} {...otherProps} />
    </AntdForm.Item>
  )
}

export default Select
