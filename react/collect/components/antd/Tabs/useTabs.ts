import type { TabsProps } from 'antd'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface UseTabsOptions extends TabsProps {
  defaultKey?: string
  /**
   * @default tab
   */
  searchParamKey?: string
}

/**
 * @example
 * const tabsProps = useTabs()
 * <Tabs {...tabsProps} />
 */
export const useTabs = (options?: UseTabsOptions): TabsProps => {
  const { defaultKey, searchParamKey = 'tab', ...props } = options ?? {}
  const [params, setParams] = useSearchParams()
  const activeKey = useMemo(
    () => params.get(searchParamKey) ?? defaultKey,
    [defaultKey, params, searchParamKey],
  )
  return {
    activeKey,
    onChange: activeKey => setParams({ [searchParamKey]: activeKey }),
    ...props,
  }
}
