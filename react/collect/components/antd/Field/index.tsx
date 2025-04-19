import type { Key, ReactNode } from 'react'
import type { ButtonProps, TooltipProps } from 'antd'
import EditingView from './EditingView'
import ReadView from './ReadView'
import CopyButton from './CopyButton'
import EditButton from './EditButton'

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

export interface InternalFieldProps {
  data?: any
  path?: string
  icon?: ReactNode
  label?: ReactNode
  colon?: boolean
  tooltip?: TooltipProps
  copyable?: boolean | Copyable
  editable?: boolean | Editable
  customRenderer?: (payload: {
    editing: boolean
    setEditing: (editing: boolean) => void
  }) => ReactNode
  extra?: (payload: {
    hovering: boolean
    editing: boolean
    setEditing: (editing: boolean) => void
  }) => (Omit<ButtonProps, 'type'> & {
    key: Key
  })[]
}

export type FieldType =
  | {
    type: 'text'
    value?: string
  }
  | {
    type: 'link'
    value?: string
  }
  | {
    type: 'number'
    value?: number
  }
  | {
    type: 'boolean'
    value?: boolean
  }
  | {
    type: 'customize'
    value?: any
  }

export type FieldProps = InternalFieldProps & FieldType

const Field: BFC<FieldProps> = ({ data, path = '', icon, label, colon = true, tooltip, className, style, copyable, editable, type, value, customRenderer, extra }) => {
  const [editing, setEditing] = useState(false)
  const [isFirstEdit, setIsFirstEdit] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const hovering = useAhooksHover(containerRef)
  const [saving, setSaving] = useState(false)
  const { onChange, onEdit, onOk, onCancel, ...restEditable } = useMemo(() => {
    return Object.assign({}, typeof editable === 'boolean' ? {} : editable)
  }, [editable])

  const [internalData, setInternalData] = useState<Record<string, any>>({})
  useEffect(() => {
    setInternalData(_cloneDeep(data))
  }, [data])
  const internalValue = useMemo(() => {
    if (data === undefined)
      return value

    return _get(internalData, path)
  }, [internalData, path, value, data])

  return (
    <AntdRow ref={containerRef} gutter={10} wrap={false} align="middle" className={className} style={style}>
      <AntdCol>
        <AntdTooltip {...tooltip}>
          <AntdSpace size="small">
            {icon}
            <AntdTypography.Text className="break-normal">
              {label}
              {colon && ':'}
            </AntdTypography.Text>
          </AntdSpace>
        </AntdTooltip>
      </AntdCol>

      <AntdCol flex={1}>
        <AntdFlex gap="small">
          {customRenderer?.({ editing, setEditing }) || editing
            ? (
              <EditingView
                type={type}
                value={internalValue}
                onChange={(value) => {
                  setInternalData((prev) => {
                    return immer(prev, (draft) => {
                      _set(draft, path, value)
                    })
                  })
                  onChange?.(value)
                }}
              />
              )
            : <ReadView type={type} value={internalValue} />}

          <AntdFlex gap="small">
            {editable
              ? (
                <EditButton
                  editable={restEditable}
                  hovering={hovering}
                  editing={editing}
                  saving={saving}
                  onEdit={() => {
                    onEdit?.(isFirstEdit)
                    setIsFirstEdit(false)
                    setEditing(true)
                  }}
                  onOk={async () => {
                    try {
                      setSaving(true)
                      await onOk?.()
                      setEditing(false)
                    }
                    finally {
                      setSaving(false)
                    }
                  }}
                  onCancel={() => {
                    setInternalData((prev) => {
                      return immer(prev, (draft) => {
                        _set(draft, path, _get(data, path))
                      })
                    })
                    onCancel?.()
                    setEditing(false)
                  }}
                />
                )
              : null}

            <CopyButton
              value={internalValue}
              copyable={copyable}
              hovering={hovering}
              editing={editing}
            />

            {extra?.({ hovering: false, editing, setEditing }).map(({ key, ...config }) => {
              return (
                <AntdButton
                  key={key}
                  className="h-auto! w-auto! border-none! p-0! leading-none!"
                  type="link"
                  {...config}
                />
              )
            })}
          </AntdFlex>
        </AntdFlex>
      </AntdCol>
    </AntdRow>
  )
}

export default Field
