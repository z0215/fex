import type { SchemaItem } from './Item'
import { isArray } from '~/shared'
import { Item } from './Item'

export const Render = <T,>({ items }: { items?: SchemaItem<T>[] }) => {
  return items?.map((item, index) => (
    <Item
      key={isArray(item.name) ? item.name.join('') : item.name as string ?? index}
      {...item}
    />
  ))
}
