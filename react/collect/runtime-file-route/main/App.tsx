import { App as AntApp, ConfigProvider, Skeleton, theme } from 'antd'
import { useMemo } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useTheme, useThemeToken } from '~/integrations'
import Container from './router/Container'
import { useRoutes } from './router/hooks'
import { createRoutes, rootRoute } from './router/routes'

const App = () => {
  const { dark } = useTheme()
  const [token] = useThemeToken()
  const { routes } = useRoutes()
  const router = useMemo(() => {
    const newRootRoute = { ...rootRoute }
    newRootRoute.children = routes
    newRootRoute.element = <Container />
    return createBrowserRouter(createRoutes(newRootRoute))
  }, [routes])
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token,
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntApp component="main" className="bg-base text-lg text-base">
        <RouterProvider
          router={router}
          fallbackElement={<Skeleton active loading />}
        />
      </AntApp>
    </ConfigProvider>
  )
}

export default App
