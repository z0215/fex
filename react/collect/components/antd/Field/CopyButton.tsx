import type { FieldProps } from '.'

export interface CopyButtonProps extends Pick<FieldProps, 'copyable' | 'value'> {
  hovering: boolean
  editing: boolean
}

const CopyButton: BFC<CopyButtonProps> = ({ value, copyable, hovering, editing }) => {
  const [copied, setCopied] = useState(false)

  const config = useMemo(() => {
    if (copyable === false)
      return copyable
    return Object.assign({}, copyable === true ? {} : copyable)
  }, [copyable])

  if (config === false || value === undefined || value === null || editing || !hovering)
    return null

  return (
    <AntdTooltip title={config.tooltip?.(copied) || 'Copy'}>
      <AntdButton
        className="h-auto! w-auto! border-none! p-0! leading-none!"
        type="link"
        icon={config.icon?.(copied) || copied ? <AntdCheckCircleOutlined /> : <AntdCopyOutlined />}
        onClick={async () => {
          if (copied)
            return
          const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
          await navigator.clipboard.writeText(config.text || text)
          config.onCopy?.()
          setCopied(true)
          const timer = setTimeout(() => {
            setCopied(false)
            clearTimeout(timer)
          }, 3000)
        }}
      />
    </AntdTooltip>
  )
}

export default CopyButton
