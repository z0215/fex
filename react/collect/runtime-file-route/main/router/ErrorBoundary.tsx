import { Button, Result } from 'antd'

const ErrorBoundary = () => {
  return (
    <Result
      status="error"
      title="Oops! Something went wrong."
      subTitle="It looks like we've encountered an error. Please try one of the options below:"
      extra={[
        <Button type="primary" key="console">
          Report Error
        </Button>,
        <Button key="buy">Return to Homepage</Button>,
      ]}
    />
  )
}

export default ErrorBoundary
