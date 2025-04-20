import { Space } from 'antd'

export interface DetailProps {
  id?: string
}

const Detail = ({ id }: DetailProps) => {
  return (
    <Space>
      <div>Detail ID:</div>
      <div>{id}</div>
    </Space>
  )
}

export default Detail
