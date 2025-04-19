import type { FC, Key, ReactNode, CSSProperties } from 'react'
import type { ButtonProps, SelectProps } from 'antd'
import CopyButton from './components/CopyButton'
import EditButton from './components/EditButton'
import EditingView from './components/EditingView'
import ContentView from './components/ContentView'

export interface Copyable {
  text?: string
  icon?: (copied: boolean) => ReactNode
  tooltip?: (copied: boolean) => ReactNode
  onCopy?: () => void
}

export type EditableButtonType = 'Edit' | 'Save' | 'Cancel'

export interface Editable {
  icon?: (type: EditableButtonType) => ReactNode
  tooltip?: (type: EditableButtonType) => ReactNode
  onEdit?: (isFirst: boolean) => void
  onChange?: (value: any) => void
  onOk?: () => void
  onCancel?: () => void
}

export interface InternalEditableFieldProps {
  className?: string
  style?: CSSProperties
  copyable?: boolean | Copyable
  editable?: boolean | Editable
  customRenderer?: (payload: {
    isEditing: boolean
    setIsEditing: (isEditing: boolean) => void
  }) => ReactNode
  customActions?: (payload: {
    hover: boolean
    isEditing: boolean
    setIsEditing: (isEditing: boolean) => void
  }) => (Omit<ButtonProps, 'type'> & {
    key: Key
  })[]
}

export type RenderType =
  | {
      renderType: 'text' | 'link'
      value?: string
    }
  | {
      renderType: 'number'
      value?: number
    }
  | {
      renderType: 'boolean'
      value?: boolean
    }
  | {
      renderType: 'user' | 'tag'
      value?: SelectProps
    }
  | {
      renderType: 'code'
      value?: {
        code: string
        language: string
      }
    }
  | {
      renderType: 'customize'
      value?: any
    }

export type EditableFieldProps = InternalEditableFieldProps & RenderType

const EditableField: FC<EditableFieldProps> = ({
  className,
  style,
  renderType,
  value,
  copyable,
  editable,
  customRenderer,
  customActions,
}) => {
  const [hover, setHover] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isFirstEdit, setIsFirstEdit] = useState(true)

  return (
    <div
      className={cs('flex-inline gap-10px items-center', className)}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="text-16px">
        {customRenderer?.({ isEditing, setIsEditing }) || isEditing ? (
          <EditingView
            renderType={renderType}
            value={value}
            onChange={(value) => {
              typeof editable !== 'boolean' && editable?.onChange?.(value)
            }}
            onOk={() => {
              typeof editable !== 'boolean' && editable?.onOk?.()
              setIsEditing(false)
            }}
            onCancel={() => {
              typeof editable !== 'boolean' && editable?.onCancel?.()
              setIsEditing(false)
            }}
          />
        ) : (
          <ContentView renderType={renderType} value={value} />
        )}
      </div>

      <div className="flex gap-10px h-16px">
        <EditButton
          editable={editable}
          hover={hover}
          isEditing={isEditing}
          isFirstEdit={isFirstEdit}
          onEdit={() => {
            setIsFirstEdit(false)
            setIsEditing(true)
          }}
          onOk={() => {
            setIsEditing(false)
          }}
          onCancel={() => {
            setIsEditing(false)
          }}
        />

        <CopyButton value={value} copyable={copyable} hover={hover} isEditing={isEditing} />

        {customActions?.({ hover, isEditing, setIsEditing }).map(({ key, ...config }) => {
          return (
            <AntdButton
              key={key}
              className="w-auto! h-auto! leading-none! border-none! p-0!"
              type={'link'}
              {...config}
            />
          )
        })}
      </div>
    </div>
  )
}

export default EditableField
