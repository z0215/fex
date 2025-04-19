import type { Editable } from '.'

export interface EditButtonProps {
  editable: Editable
  hovering: boolean
  editing: boolean
  saving: boolean
  onEdit: () => void
  onOk: () => void
  onCancel: () => void
}

const EditButton: BFC<EditButtonProps> = ({
  editable,
  hovering,
  editing,
  saving,
  onEdit,
  onOk,
  onCancel,
}) => {
  if (editing) {
    return (
      <>
        <AntdTooltip title={editable.tooltip?.('Cancel') || 'Cancel'}>
          <AntdButton
            className="h-auto! w-auto! border-none! p-0! leading-none!"
            type="link"
            icon={editable.icon?.('Cancel') || <AntdCloseOutlined />}
            onClick={onCancel}
          />
        </AntdTooltip>

        <AntdTooltip title={editable.tooltip?.('Save') || 'Save'}>
          <AntdButton
            className="h-auto! w-auto! border-none! p-0! leading-none!"
            type="link"
            icon={editable.icon?.('Save') || <AntdCheckOutlined />}
            loading={saving}
            onClick={onOk}
          />
        </AntdTooltip>
      </>
    )
  }

  if (hovering) {
    return (
      <AntdTooltip title={editable.tooltip?.('Edit') || 'Edit'}>
        <AntdButton
          className="h-auto! w-auto! border-none! p-0! leading-none!"
          type="link"
          icon={editable.icon?.('Edit') || <AntdEditOutlined />}
          onClick={onEdit}
        />
      </AntdTooltip>
    )
  }
}

export default EditButton
