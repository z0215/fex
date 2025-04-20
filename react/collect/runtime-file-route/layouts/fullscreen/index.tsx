import { Flex } from 'antd'

const FullscreenLayout = ({ children }: LayoutProps) => {
  return (
    <Flex vertical component="main" className="box-border h-screen w-screen overflow-auto p-lg">
      {children}
    </Flex>
  )
}

export default FullscreenLayout
