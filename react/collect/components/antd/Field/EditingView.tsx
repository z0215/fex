import type { FieldType } from '.'

export type EditingViewProps = FieldType & {
  onChange: (value: any) => void
}

const EditingView: BFC<EditingViewProps> = ({ type, value, onChange }) => {
  if (type === 'text')
    return <AntdInput.TextArea value={value} onChange={e => onChange(e.target.value)} />

  if (type === 'link') {
    return (
      <AntdInput
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  if (type === 'number')
    return <AntdInputNumber value={value} onChange={value => onChange(value)} />

  if (type === 'boolean') {
    return (
      <AntdRadio.Group
        value={value}
        options={[
          { label: 'True', value: true },
          { label: 'False', value: false },
        ]}
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  return null
}

export default EditingView
