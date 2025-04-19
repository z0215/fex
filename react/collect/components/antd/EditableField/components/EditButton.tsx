import type { FC } from 'react'
import { EditableFieldProps } from '..'

export interface EditButtonProps extends Pick<EditableFieldProps, 'editable'> {
  hover: boolean
  isEditing: boolean
  isFirstEdit: boolean
  onEdit: () => void
  onOk: () => void
  onCancel: () => void
}

const EditButton: FC<EditButtonProps> = ({
  editable,
  hover,
  isEditing,
  isFirstEdit,
  onEdit,
  onOk,
  onCancel,
}) => {
  const config = useMemo(() => {
    if (editable === false) return editable
    return Object.assign({}, editable === true ? {} : editable)
  }, [editable])

  if (config === false) return null

  if (isEditing) {
    return (
      <>
        <AntdTooltip title={config.tooltip?.('Cancel')}>
          <AntdButton
            className="w-auto! h-auto! leading-none! border-none! p-0!"
            type={'link'}
            icon={config.icon?.('Cancel') || <CloseOutlined />}
            onClick={() => {
              config.onCancel?.()
              onCancel()
            }}
          />
        </AntdTooltip>

        <AntdTooltip title={config.tooltip?.('Save')}>
          <AntdButton
            className="w-auto! h-auto! leading-none! border-none! p-0!"
            type={'link'}
            icon={config.icon?.('Save') || <CheckOutlined />}
            onClick={() => {
              config.onOk?.()
              onOk()
            }}
          />
        </AntdTooltip>
      </>
    )
  }

  if (hover) {
    return (
      <AntdTooltip title={config.tooltip?.('Edit')}>
        <AntdButton
          className="w-auto! h-auto! leading-none! border-none! p-0!"
          type={'link'}
          icon={config.icon?.('Edit') || <EditOutlined />}
          onClick={() => {
            config.onEdit?.(isFirstEdit)
            onEdit()
          }}
        />
      </AntdTooltip>
    )
  }
}

export default EditButton
