import type { QuickerResultItem } from '../'
import { useMemo } from 'react'
import { useHeader } from '~/layouts/dynamic/layout-structure/useHeader'
import { useSider } from '~/layouts/dynamic/layout-structure/useSider'

export const useActions = (): QuickerResultItem[] => {
  const [height, { toggle: toggleHeader }] = useHeader()
  const [{ width }, { toggle: toggleSider }] = useSider()

  return useMemo(() => [
    {
      label: `${height ? 'Hide' : 'Show'} Header`,
      key: 'change-header',
      tag: 'Action',
      keys: ['Hide', 'Show', 'Header'],
      action() {
        toggleHeader()
      },
    },
    {
      label: `${width ? 'Hide' : 'Show'} Sider`,
      key: 'change-sider',
      tag: 'Action',
      keys: ['Hide', 'Show', 'Sider'],
      action() {
        toggleSider()
      },
    },
  ], [height, toggleHeader, toggleSider, width])
}
