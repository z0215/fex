import {
  Layout,
  Menu,
  Splitter,
} from 'antd'
import { classNames } from '~/shared'
import MenuSettings from './MenuSettings'
import { useHeaderPanel } from './useHeader'
import { useMenu } from './useMenu'
import { useSiderPanel } from './useSider'
import './style.css'

export const Case4 = ({ children }: LayoutProps) => {
  const [onResizeHeight, headerPanelProps] = useHeaderPanel()
  const [onResizeSider, siderPanelProps] = useSiderPanel()
  const { setThirdParty, thirdParty, pinned, ...menuProps } = useMenu()

  return (
    <Layout className="h-screen w-screen">
      <Splitter layout="vertical" onResize={onResizeHeight}>
        <Splitter.Panel {...headerPanelProps} className="p-0!">
          <Layout.Header className="flex items-center bg-base">
            <div className="logo m-r-base h-32px w-120px rounded-6px bg-[#0003]" />
          </Layout.Header>
        </Splitter.Panel>

        <Splitter.Panel className="p-0!">
          <Layout className="h-full">
            <Splitter onResize={onResizeSider}>
              <Splitter.Panel {...siderPanelProps} className="h-full flex flex-col bg-base p-0!">
                <div className="border-b-2px border-b-[var(--ant-control-item-bg-hover)] border-b-solid p-base">
                  <MenuSettings
                    pinned={pinned}
                    thirdParty={thirdParty}
                    onSave={setThirdParty}
                  />
                </div>
                <Menu
                  {...menuProps}
                  inlineCollapsed={siderPanelProps.size === siderPanelProps.min}
                  className={classNames(menuProps.className, 'overflow-y-auto flex-1 no-scroll-bar')}
                />
              </Splitter.Panel>

              <Splitter.Panel className="flex p-0!">
                <Layout.Content className="content relative overflow-auto bg-base p-lg">
                  {children}
                </Layout.Content>
              </Splitter.Panel>
            </Splitter>
          </Layout>
        </Splitter.Panel>
      </Splitter>
    </Layout>
  )
}
