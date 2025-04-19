import type { TabsProps as ATabsProps } from 'antd'
import type { ComponentType } from '../Item'
import { Tabs as ATabs } from 'antd'
import { useMemo } from 'react'
import type { ArrayToUnion } from '~/shared'
import { Render } from '../Render'

export interface TabsProps extends Omit<ATabsProps, 'items'> {
  items?: Array<ArrayToUnion<ATabsProps['items']> & { items?: ComponentType[] }>
}

export const Tabs = ({ items: userItems, ...props }: TabsProps) => {
  const items = useMemo(() => {
    return userItems?.map(({ items, ...item }) => ({
      ...item,
      children: <Render items={items} />,
    }))
  }, [userItems])
  return <ATabs {...props} items={items} />
}
