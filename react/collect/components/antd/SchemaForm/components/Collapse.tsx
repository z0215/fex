import type { CollapseProps as ACollapseProps } from 'antd'
import type { ComponentType } from '../Item'
import { Collapse as ACollapse } from 'antd'
import { useMemo } from 'react'
import type { ArrayToUnion } from '~/shared'
import { Render } from '../Render'

export interface CollapseProps extends Omit<ACollapseProps, 'items'> {
  items?: Array<ArrayToUnion<ACollapseProps['items']> & { items?: ComponentType[] }>
}

export const Collapse = ({ items: userItems, ...props }: CollapseProps) => {
  const items = useMemo(() => {
    return userItems?.map(({ items, ...item }) => ({
      ...item,
      children: <Render items={items} />,
    }))
  }, [userItems])
  return <ACollapse {...props} items={items} />
}
