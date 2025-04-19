import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { useMemo, useState } from 'react'
import { capitalize, Icon } from '~/shared'
import { TokenModal } from './Modal'
import { themeIcon, useTheme } from './useTheme'

export const ThemePicker = () => {
  const { setTheme, themes, theme } = useTheme()
  const [visibleTokenModal, setVisibleTokenModal] = useState(false)

  const items = useMemo<MenuProps['items']>(() => {
    return [
      ...themes.map(t => (
        {
          key: t,
          label: capitalize(t),
          icon: <i className={themeIcon(t)} />,
          onClick: () => setTheme(t),
        }
      )),
      {
        type: 'divider',
      },
      {
        key: 'custom',
        label: 'Custom',
        icon: <Icon type="Palette" />,
        onClick: () => setVisibleTokenModal(true),
      },
    ]
  }, [setTheme, themes])

  return (
    <>
      <Dropdown menu={{ items, selectable: true, selectedKeys: [theme] }}>
        <i className={themeIcon(theme)} />
      </Dropdown>

      <TokenModal
        title="Custom Token"
        open={visibleTokenModal}
        onCancel={() => setVisibleTokenModal(false)}
      />
    </>
  )
}
