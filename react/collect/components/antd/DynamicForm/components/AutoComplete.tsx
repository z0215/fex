import type { IAutoComplete } from '../type'
import { useOptions } from './hooks'

const AutoComplete: React.FC<IAutoComplete> = ({ options, ...rest }) => {
  const { options: selectOptions, ...otherProps } = useMemo(() => {
    return options ?? {}
  }, [options])
  const { data, loading } = useOptions(selectOptions)
  return (
    <AntdForm.Item {...rest}>
      <AntdAutoComplete
        style={{ width: '100%' }}
        options={data}
        disabled={loading}
        {...otherProps}
      />
    </AntdForm.Item>
  )
}

export default AutoComplete
