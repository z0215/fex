import type { FunctionComponent } from 'react'
import type { RouteMeta } from './routes'
import { Suspense, useEffect, useMemo } from 'react'
import { Outlet, useLocation, useMatches } from 'react-router-dom'
import { Quicker, useLastVisitedPage } from '~/integrations'
import { capitalize } from '~/shared'
import { name } from '../../../package.json'

const layouts = Object.entries(
  import.meta.glob<FunctionComponent<any>>('~/layouts/*/index.tsx', {
    eager: true,
    import: 'default',
  }),
).reduce<Record<string, FunctionComponent<any>>>(
  (acc, [path, component]) => {
    const name = path.replace(/\/src\/layouts\/(.*)\/index\.tsx$/, '$1')
    acc[name] = component
    return acc
  },
  {},
)

const Container = () => {
  const matches = useMatches()
  const meta = useMemo(() => {
    const match = matches.at(-1)
    if (!match)
      return
    return match.data as RouteMeta
  }, [matches])
  const LayoutContainer = useMemo(() => layouts[meta?.layout ?? 'default'], [meta])
  useEffect(() => {
    document.title = `${meta?.label ?? 'Not Found'} - ${capitalize(name)}`
  }, [meta])
  const { pathname } = useLocation()
  const [,setLastPage] = useLastVisitedPage()
  useEffect(() => {
    pathname !== '/' && setLastPage(pathname)
  }, [pathname])
  return (
    <LayoutContainer>
      <Suspense>
        <Outlet />
      </Suspense>
      <Quicker />
    </LayoutContainer>
  )
}

export default Container
