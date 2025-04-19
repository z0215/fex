import type { FC } from 'react'
import { CollapseProps as AntdCollapseProps } from 'antd'
import SchemaFormItem, { BasicSchemaFormItem, SchemaFormItemProps } from './SchemaFormItem'
import SchemaFormItemGroup from './SchemaFormItemGroup'

export type AntdCollapseItemType = Required<AntdCollapseProps>['items'][number]

export interface CollapseProps extends BasicSchemaFormItem<AntdCollapseProps> {
  items?: (AntdCollapseItemType & {
    formItems?: SchemaFormItemProps[]
  })[]
}

const Collapse: FC<CollapseProps> = ({ formItemProps, componentProps, items }) => {
  const transformedItems = useMemo(() => {
    return items?.map<AntdCollapseItemType>(({ formItems, ...config }) => {
      const children = formItems?.map((f) => (
        <SchemaFormItem key={f.key || f.formItemProps?.name} {...(f as any)} />
      ))
      return {
        ...config,
        children: children,
      }
    })
  }, [items])

  return (
    <AntdForm.Item label={formItemProps?.label}>
      <SchemaFormItemGroup prefix={formItemProps?.name}>
        <AntdCollapse items={transformedItems} {...componentProps} />
      </SchemaFormItemGroup>
    </AntdForm.Item>
  )
}

export default Collapse
