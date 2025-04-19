import type { AliasToken } from 'antd/es/theme/interface'
import { theme } from 'antd'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const defaultToken = theme.getDesignToken()

export type ThemeToken = Partial<AliasToken>

const useThemeTokenStore = create(
  persist<ThemeToken>(
    () => ({
      colorPrimary: defaultToken.colorPrimary,
    }),
    { name: 'themeToken' },
  ),
)

export const useThemeToken = () => {
  return [useThemeTokenStore(), useThemeTokenStore.setState] as const
}
