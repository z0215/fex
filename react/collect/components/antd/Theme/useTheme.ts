import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { classNames } from '~/shared'
import { useDark } from './useDark'

const AUTO = 'auto'

export const themes = ['dark', 'light', AUTO] as const

export const themeIcon = (theme: Theme) => classNames({
  'i-ic:outline-brightness-6': theme === 'auto',
  'i-ic:outline-light-mode': theme === 'light',
  'i-ic:outline-dark-mode': theme === 'dark',
})

export type Theme = typeof themes[number]

const useThemeStore = create(
  persist<{ theme: Theme }>(
    () => ({ theme: AUTO }),
    { name: 'theme' },
  ),
)

export const useTheme = () => {
  const osDark = useDark()
  const { theme } = useThemeStore()
  const dark = useMemo(
    () => theme === AUTO ? osDark : theme === 'dark',
    [osDark, theme],
  )
  return {
    dark,
    theme,
    themes,
    setTheme: (theme: Theme) => useThemeStore.setState({ theme }),
  }
}
