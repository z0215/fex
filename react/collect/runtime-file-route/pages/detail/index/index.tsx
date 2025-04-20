import { Drawer, Space, Typography } from 'antd'
import { Link, useSearchParams } from 'react-router-dom'
import Detail from '../components/Detail'

const Page = () => {
  const [params, setParams] = useSearchParams()
  return (
    <>
      <Space>
        <Link to="123456">Detail page</Link>

        <Typography.Link onClick={() => setParams({ id: '123456' })}>Detail Drawer</Typography.Link>
      </Space>

      <Drawer
        open={params.get('id') !== null}
        onClose={() => {
          setParams((p) => {
            p.delete('id')
            return p
          })
        }}
        width={1000}
      >
        <Detail id={params.get('id')!} />
      </Drawer>
    </>
  )
}

export default Page
