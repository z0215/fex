import type { DropdownProps as ADropdownProps } from 'antd'
import type { ReactNode } from 'react'
import { Dropdown as ADropdown, Button } from 'antd'
import { Icon, isFunction } from '~/shared'
import { useDropdown, type UseDropdownOptions } from './useDropdown'

export interface DropdownProps extends Omit<ADropdownProps, 'children'>, Pick<UseDropdownOptions, 'autoLoading'> {
  children?: ReactNode | ((loading: boolean) => ReactNode)
}

export const Dropdown = ({
  autoLoading,
  children,
  ...props
}: DropdownProps) => {
  const { menu, loading } = useDropdown({ autoLoading, menu: props.menu })
  return (
    <ADropdown {...props} menu={menu}>
      {isFunction(children) ? children(loading) : children ?? <Button type="text" loading={loading} icon={<Icon type="More" />} />}
    </ADropdown>
  )
}
