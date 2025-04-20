import { Result } from 'antd'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={[
        <Link key="/" to="/">
          Go Home
        </Link>,
      ]}
    />
  )
}

export default NotFound
