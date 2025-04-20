import { Breadcrumb, Layout, Menu } from 'antd'

export const Case2 = ({ children }: LayoutProps) => {
  return (
    <Layout className="h-screen w-screen">
      <Layout.Header className="flex items-center">
        <div className="m-r-base h-32px w-120px rounded-6px bg-[#fff3]" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['0']}
          items={Array.from({ length: 3 }, (_, i) => ({
            key: i,
            icon: <i className="i-ic:sharp-person" />,
            label: `nav ${i}`,
          }))}
        />
      </Layout.Header>

      <Layout>
        <Layout.Sider className="overflow-y-auto bg-base">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            items={Array.from({ length: 30 }, (_, i) => ({
              key: i,
              icon: <i className="i-ic:sharp-person" />,
              label: `nav ${i}`,
            }))}
            className="border-none!"
          />
        </Layout.Sider>

        <Layout className="flex-col p-x-lg p-b-lg">
          <Breadcrumb
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
            className="m-y-base"
          />
          <Layout.Content className="overflow-auto rounded-lg bg-base p-lg">
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
    </Layout>
  )
}
