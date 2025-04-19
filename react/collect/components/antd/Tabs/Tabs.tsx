import type { TabsProps as ATabsProps } from 'antd'
import type { UseTabsOptions } from './useTabs'
import { Tabs as ATabs } from 'antd'
import { useTabs } from './useTabs'

export interface TabsProps extends ATabsProps, UseTabsOptions {}

export const Tabs = ({ defaultKey, searchParamKey, ...props }: TabsProps) => {
  const tabsProps = useTabs({ defaultKey, searchParamKey })
  return <ATabs {...tabsProps} {...props} />
}
