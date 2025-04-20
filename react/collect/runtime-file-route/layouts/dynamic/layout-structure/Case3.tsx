import { Flex, Layout, Menu } from 'antd'

export const Case3 = ({ children }: LayoutProps) => {
  return (
    <Layout className="h-screen w-screen">
      <Layout.Sider trigger={null}>
        <Flex vertical className="h-full">
          <div className="p-16px">
            <div className="h-32px rounded-6px bg-[#fff3]" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={Array.from({ length: 30 }, (_, i) => ({
              key: i,
              icon: <i className="i-ic:sharp-person" />,
              label: `nav ${i}`,
            }))}
            className="flex-1 overflow-y-auto"
          />
        </Flex>
      </Layout.Sider>

      <Layout>
        <Layout.Header className="flex items-center justify-between bg-base p-0px">
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['0']}
            items={Array.from({ length: 3 }, (_, i) => ({
              key: i,
              icon: <i className="i-ic:sharp-person" />,
              label: `nav ${i}`,
            }))}
          />
        </Layout.Header>

        <Layout.Content className="m-lg overflow-auto rounded-lg bg-base p-lg">
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>
              Content
              {i}
            </p>
          ))}
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
