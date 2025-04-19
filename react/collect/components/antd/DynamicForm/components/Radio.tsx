import type { IRadio } from '../type'
import { useOptions } from './hooks'

const Radio: React.FC<IRadio> = ({ options, ...rest }) => {
  const { options: selectOptions, ...otherProps } = useMemo(() => {
    return options ?? {}
  }, [options])
  const { data, loading } = useOptions(selectOptions)
  return (
    <AntdForm.Item {...rest}>
      <AntdRadio.Group options={data} disabled={loading} {...otherProps} />
    </AntdForm.Item>
  )
}

export default Radio
