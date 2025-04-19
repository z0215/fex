import type { FC } from 'react'
import { EditableFieldProps } from '..'

export interface CopyButtonProps extends Pick<EditableFieldProps, 'copyable' | 'value'> {
  hover: boolean
  isEditing: boolean
}

const CopyButton: FC<CopyButtonProps> = ({ value, copyable, hover, isEditing }) => {
  const [copied, setCopied] = useSafeState(false)

  const config = useMemo(() => {
    if (copyable === false) return copyable
    return Object.assign({}, copyable === true ? {} : copyable)
  }, [copyable])

  if (config === false || value === undefined || value === null || isEditing || !hover) return null

  return (
    <AntdTooltip title={config.tooltip?.(copied)}>
      <AntdButton
        className="w-auto! h-auto! leading-none! border-none! p-0!"
        type={'link'}
        icon={config.icon?.(copied) || copied ? <CheckCircleOutlined /> : <CopyOutlined />}
        onClick={async () => {
          if (copied) return
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
