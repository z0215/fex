import type { SchemaFormItemProps } from './SchemaFormItem'
import SchemaFormItem from './SchemaFormItem'

export interface SchemaFormProps {
  schema: SchemaFormItemProps[]
}

const SchemaForm: BFC<SchemaFormProps> = ({ schema }) => {
  return schema.map((item) => {
    if (item.formItemOptions?.dependencies?.length) {
      return (
        <AntdForm.Item key={item.formItemOptions?.name} noStyle dependencies={item.formItemOptions?.dependencies}>
          {({ getFieldsValue }) => {
            const deps = getFieldsValue(item.formItemOptions?.dependencies || [])
            const show = Object.values(deps).every(Boolean)
            return show ? <SchemaFormItem key={item.formItemOptions?.name} {...item} /> : null
          }}
        </AntdForm.Item>
      )
    }

    return <SchemaFormItem key={item.formItemOptions?.name} {...item} />
  })
}

export default SchemaForm
