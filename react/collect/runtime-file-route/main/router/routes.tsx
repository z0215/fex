import type { FunctionComponent, ReactNode } from 'react'
import type { PageMeta } from './meta'
import { lazy } from 'react'
import ErrorBoundary from './ErrorBoundary'

const pageMetas = Object
  .entries(
    import.meta.glob<PageMeta>(
      '~/pages/**/meta.ts',
      {
        eager: true,
        import: 'default',
      },
    ),
  )
  .reduce<Record<string, PageMeta>>((res, [fullPath, meta]) => {
    const path = fullPath.replace(/\/src\/pages\/(.*)\/meta\.ts$/, '$1')
    res[path.replace(/\/?index$/, '')] = meta
    return res
  }, {})

const pages = Object
  .entries(
    import.meta.glob<{ default: FunctionComponent }>('~/pages/**/*.tsx'),
  )
  .reduce<Record<string, any>>((res, [fullPath, element]) => {
    const path = fullPath.replace(/\/src\/pages\/(.*?)(\/index)?\.tsx$/, '$1')
    const Component = lazy(element)
    res[path.replace(/\/?index$/, '')] = <Component />
    return res
  }, {})

const pagePaths = Object.keys(pages)

export interface MetaRoute {
  path: string
  fullPath?: string
  element?: ReactNode
  children?: MetaRoute[]
  loader?: () => RouteMeta | null
  meta?: RouteMeta
  errorElement?: ReactNode
}

const wildcard = '*'

export interface RouteMeta extends PageMeta {
  isPage?: boolean
}

const createRootRoute = (paths: string[]) => {
  const root: MetaRoute = {
    path: '/',
    errorElement: <ErrorBoundary />,
  }

  const insertPath = (node: MetaRoute, pathSegments: string[], parentPath = '') => {
    if (!pathSegments.length)
      return

    const currentPath = pathSegments.shift()
    if (currentPath === undefined)
      return

    let childNode = node.children?.find(({ path }) => path === currentPath)
    const fullPath = `${parentPath}${parentPath ? '/' : ''}${currentPath}`
    const meta = pageMetas[fullPath]
    if (!meta?.visible)
      return

    if (!childNode) {
      childNode = {
        path: currentPath,
        fullPath,
        meta,
        loader: () => meta ?? null,
        errorElement: <ErrorBoundary />,
      }
      const element = pages[fullPath]
      if (element) {
        childNode.element = element
      }
      if (childNode.meta) {
        childNode.meta.isPage = !!element
      }
      if (node.children) {
        node.children.push(childNode)
      }
      else {
        let parentNode: MetaRoute | null = null
        if (node.element) {
          parentNode = { ...node, path: '' }
          Reflect.deleteProperty(node, 'element')
        }
        node.children = parentNode ? [parentNode, childNode] : [childNode]
      }
    }

    if (pathSegments.length) {
      insertPath(childNode, pathSegments, fullPath)
    }
  }

  paths.forEach((path) => {
    if (path === wildcard)
      return

    insertPath(root, path.split('/'))
  })

  return root
}

export const rootRoute = createRootRoute(pagePaths)

export const createRoutes = (rootRoute: MetaRoute) => {
  const result = [rootRoute]
  const all = pages[wildcard]
  if (all) {
    result.push({
      path: wildcard,
      element: all,
      errorElement: <ErrorBoundary />,
    })
  }
  return result
}
