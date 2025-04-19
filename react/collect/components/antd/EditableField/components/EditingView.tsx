import type { FC } from 'react'
import type { RenderType } from '..'

export type EditingViewProps = RenderType & {
  onChange: (value: any) => void
  onOk: () => void
  onCancel: () => void
}

const EditingView: FC<EditingViewProps> = ({ renderType, value, onChange, onOk, onCancel }) => {
  switch (renderType) {
    case 'text':
      return <AntdInput value={value} onChange={(e) => onChange(e.target.value)} />
    case 'number':
      return <AntdInputNumber value={value} onChange={(e) => onChange(e)} />
    case 'link':
      return <AntdInput value={value} onChange={(e) => onChange(e.target.value)} />
    case 'boolean':
      return (
        <AntdRadio.Group value={value} onChange={(e) => onChange(e.target.value)}>
          <AntdRadio value={false}>false</AntdRadio>
          <AntdRadio value={true}>true</AntdRadio>
        </AntdRadio.Group>
      )
    case 'user':
      // TODO: 额外的props
      return <AntdSelect value={value?.value} {...value} onChange={onChange} />
    case 'tag':
      // TODO: 额外的props
      return <AntdSelect value={value?.value} {...value} onChange={onChange} />
    case 'code':
      // TODO: 编辑器实现
      return (
        <>
          <CodeOutlined />
          <AntdModal title="Edit code" open={true} onOk={onOk} onCancel={onCancel}>
            <p>
              {value?.code}/{value?.language}
            </p>
            <p>Some codes...</p>
            <p>Some codes...</p>
            <p>Some codes...</p>
          </AntdModal>
        </>
      )
    default:
      return null
  }
}

export default EditingView
