import type { BreadcrumbProps } from 'antd'
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { isString } from '@shared/utils'
import { Breadcrumb } from 'antd'
import { useMemo } from 'react'
import { Link, useLocation, useMatches } from 'react-router-dom'
import type { RouteMeta } from '~/main/router'

export const RouteBreadcrumb = (props: BreadcrumbProps) => {
  const matches = useMatches()
  const { pathname } = useLocation()
  const items = useMemo(() => {
    const currentIndex = matches.findIndex(item => item.pathname === pathname)
    const result = matches.slice(0, currentIndex + 1).filter(({ data }) => data).map<BreadcrumbItemType>(({ data, pathname }, index, arr) => {
      const meta = data as RouteMeta
      const isLast = arr.length - 1 === index
      return {
        title: isLast || !meta.isPage ? meta.label : <Link key={pathname} to={pathname}>{meta.label}</Link>,
      }
    })
    return result
  }, [matches, pathname])

  return items.filter(({ title }) => !isString(title)).length ? <Breadcrumb items={items} {...props} /> : null
}
