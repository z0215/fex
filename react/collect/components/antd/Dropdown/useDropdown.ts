import type { DropdownProps as ADropdownProps } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'
import { useState } from 'react'

export interface UseDropdownOptions extends Pick<ADropdownProps, 'menu'> {
  autoLoading?: boolean
}

export const useDropdown = (options?: UseDropdownOptions): Pick<ADropdownProps, 'menu'> & { loading: boolean } => {
  const { menu, autoLoading } = options ?? {}
  const [loading, setLoading] = useState(false)
  return {
    menu: {
      ...menu,
      async onClick(info) {
        menu?.onClick?.(info)
        if (!autoLoading)
          return
        try {
          const current = menu?.items?.find(i => i?.key === info.key)
          if (!current)
            return
          setLoading(true)
          await (current as MenuItemType).onClick?.(info)
        }
        finally {
          setLoading(false)
        }
      },
    },
    loading,
  }
}
