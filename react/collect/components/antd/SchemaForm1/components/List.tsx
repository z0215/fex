import type { FC } from 'react'
import SchemaFormItem, { BasicSchemaFormItem, SchemaFormItemProps } from './SchemaFormItem'

export interface ListProps
  extends BasicSchemaFormItem<{
    formItems?: SchemaFormItemProps[]
    addButtonWording?: string
  }> {}

const List: FC<ListProps> = ({ formItemProps, componentProps = {} }) => {
  const { addButtonWording = 'Add Field', formItems = [] } = componentProps

  return (
    <AntdForm.Item {...formItemProps}>
      <AntdForm.List name={formItemProps?.name}>
        {(fields, { add, remove }, { errors }) => {
          return (
            <div className="flex flex-col gap-10px w-full">
              {fields.map((field) => (
                <div key={field.key} className="flex gap-10px items-center">
                  {formItems.map((item) => {
                    return (
                      <SchemaFormItem
                        key={item.key || item.formItemProps?.name}
                        {...(item as any)}
                        formItemProps={{
                          ...item.formItemProps,
                          className: 'flex-1',
                          noStyle: true,
                          name: [field.name, item.formItemProps?.name],
                        }}
                      />
                    )
                  })}

                  <DeleteOutlined onClick={() => remove(field.name)} />
                </div>
              ))}
              <AntdForm.ErrorList errors={errors} />
              <AntdButton type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>
                {addButtonWording}
              </AntdButton>
            </div>
          )
        }}
      </AntdForm.List>
    </AntdForm.Item>
  )
}

export default List
