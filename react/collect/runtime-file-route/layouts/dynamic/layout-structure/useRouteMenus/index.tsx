import type { MenuProps } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'
import { type ReactNode, useMemo, useState } from 'react'
import { useMatches } from 'react-router-dom'
import { useRoutes } from '~/main/router/hooks'
import type { MetaRoute, RouteMeta } from '~/main/router/routes'
import { sort } from '~/shared'
import { useTheme } from '../Theme'
import './style.css'

const useSelectedKey = () => {
  const matches = useMatches()
  return useMemo(() => {
    while (matches.length) {
      const last = matches.pop()
      if (!last?.data)
        return ''

      const meta = last.data as RouteMeta
      if (meta.isMenu)
        return last.pathname.replace(/^\/|\/$/g, '')
    }

    return ''
  }, [matches])
}

interface CallbackPayload {
  key: string
  label: string
  leaf: boolean
  hover: boolean
}

type OriginMenuItem = Pick<MenuItemType, 'className' | 'disabled' | 'ref' | 'style' | 'onClick' | 'onMouseEnter' | 'onMouseLeave'>

export interface MenuItem extends OriginMenuItem {
  key: string
  icon?: ReactNode
  label?: ReactNode
  extra?: ReactNode
  meta: RouteMeta
  children?: MenuItem[]
}

export interface UseRouteMenusOptions extends OriginMenuItem {
  icon?: (icon: string) => ReactNode
  label?: (item: CallbackPayload) => ReactNode
  extra?: (item: CallbackPayload) => ReactNode
}

export const useRouteMenus = (options?: UseRouteMenusOptions) => {
  const { dark } = useTheme()
  const { icon, label, extra, ...restProps } = options ?? {}
  const [hoverKey, setHoverKey] = useState<string>()
  const selectedKey = useSelectedKey()
  const { routes, thirdParty, setThirdParty } = useRoutes()

  const menus = useMemo(() => {
    const createMenus = (routes: MetaRoute[], depth = 1) => {
      const result = routes.map((item) => {
        const meta = item.loader?.()
        if (!meta?.isMenu || item.fullPath === undefined)
          return undefined

        const data: MenuItem = {
          key: item.fullPath,
          meta,
          onMouseEnter: (e) => {
            setHoverKey(e.key)
            restProps.onMouseEnter?.(e)
          },
          onMouseLeave: (e) => {
            setHoverKey(undefined)
            restProps.onMouseLeave?.(e)
          },
        }
        if (meta.icon && icon) {
          data.icon = icon(meta.icon)
        }
        const children = item.children?.filter((c) => {
          const meta = c.loader?.()
          return meta?.isMenu && c.path
        })

        const payload: CallbackPayload = {
          key: `/${data.key}`,
          label: meta.label,
          leaf: !children?.length,
          hover: hoverKey === data.key,
        }
        data.label = label?.(payload) ?? meta.label

        if (children?.length) {
          data.children = sort(createMenus(children, depth + 1), ({ meta }) => meta.order ?? -1)
        }
        else {
          data.extra = extra?.(payload)
        }

        return {
          ...data,
          ...restProps,
        }
      })

      return sort(result.filter(i => i !== undefined), ({ meta }) => meta.order ?? -1)
    }

    const menus = createMenus(routes)
    return menus
  }, [extra, hoverKey, icon, label, restProps, routes])

  const menuProps = useMemo<MenuProps>(() => ({
    mode: 'inline',
    items: menus,
    className: 'route-menu h-full border-none!',
    theme: dark ? 'dark' : 'light',
  }), [dark, menus])

  return {
    ...menuProps,
    setThirdParty,
    thirdParty,
    selectedKey,
  }
}
