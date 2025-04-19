import type { QuickerResultItem } from '../'
import { themes as originThemes, themeIcon, useTheme } from '~/integrations'
import { capitalize } from '~/shared'

export const useThemes = (): QuickerResultItem[] => {
  const { setTheme } = useTheme()
  return originThemes.map<QuickerResultItem>(theme => ({
    icon: themeIcon(theme),
    label: capitalize(theme),
    key: theme,
    tag: 'Theme',
    keys: ['Theme'],
    action() {
      setTheme(theme)
    },
  }))
}
