import type { FormListProps } from 'antd/es/form/FormList'
import type { SchemaItem } from '../Item'
import { Button, Flex, Form, theme } from 'antd'
import { castArray, Icon } from '~/shared'
import { Render } from '../Render'

export interface ListProps extends Omit<FormListProps, 'children'> {
  items?: SchemaItem<any>[]
  addText?: string
  layout?: 'horizontal' | 'vertical'
}

export const List = ({ items, addText, layout, ...props }: ListProps) => {
  const { token } = theme.useToken()
  return (
    <Form.List {...props}>
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map(field => (
              <Form.Item key={field.key}>
                <Flex align="center" gap={token.marginXS}>
                  <Flex
                    flex={1}
                    gap={token.marginXS}
                    vertical={layout === 'vertical'}
                  >
                    <Render
                      items={items?.map(item => ({
                        ...item,
                        noStyle: true,
                        name: [field.name, ...castArray(item.name)] as any,
                      }))}
                    />
                  </Flex>
                  <Button
                    type="dashed"
                    danger
                    icon={<Icon type="Delete" />}
                    onClick={() => {
                      remove(field.name)
                    }}
                  />
                </Flex>
              </Form.Item>
            ))}
            <Button
              icon={<Icon type="Add" />}
              type="dashed"
              onClick={() => add({})}
              block
            >
              {addText ?? 'Add Item'}
            </Button>
          </div>
        )
      }}
    </Form.List>
  )
}
