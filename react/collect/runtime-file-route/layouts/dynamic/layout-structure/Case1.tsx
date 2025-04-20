import { Breadcrumb, Layout, Menu } from 'antd'

export const Case1 = ({ children }: LayoutProps) => {
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

      <Layout.Content className="flex flex-col p-x-xxl">
        <Breadcrumb
          items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
          className="m-y-base"
        />
        <div className="flex-1 overflow-auto rounded-lg bg-base p-lg">
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>
              Content
              {i}
            </p>
          ))}
          {children}
        </div>
      </Layout.Content>

      <Layout.Footer className="text-center">
        Ideas ©
        {new Date().getFullYear()}
      </Layout.Footer>
    </Layout>
  )
}
