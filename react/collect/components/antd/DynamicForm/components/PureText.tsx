import type { IPureText } from '../type'

const defaultOptions: IPureText['options'] = {
  displayType: 'normal',
  type: 'info',
}

const PureText: React.FC<IPureText> = ({ options, ...rest }) => {
  const mergedOptions = useMemo(() => {
    return {
      ...defaultOptions,
      ...options,
    }
  }, [options])

  const getColor = useMemoizedFn((type: IPureText['options']['type']) => {
    switch (type) {
      case 'info':
        return 'inherit'
      case 'error':
        return '#ff4d4f'
      case 'success':
        return '#52c41a'
      case 'warning':
        return '#faad14'
      default:
    }
  })

  const type = useMemo(() => {
    if (['info', 'error', 'success', 'warning'].includes(mergedOptions.type ?? ''))
      return mergedOptions.type
    return defaultOptions.type
  }, [mergedOptions.type])

  return (
    <AntdForm.Item {...rest}>
      {!mergedOptions.displayType || mergedOptions.displayType === 'normal' ? (
        <span style={{ color: getColor(mergedOptions.type) }}>{rest.value}</span>
      ) : (
        <AntdAlert message={rest.value} showIcon type={type}></AntdAlert>
      )}
    </AntdForm.Item>
  )
}

export default PureText
