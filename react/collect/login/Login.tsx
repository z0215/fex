import { useMutation } from '@tanstack/react-query'
import {
  Button,
  Form,
  Input,
} from 'antd'
import { delay } from '~/shared'

interface UserForm {
  username: string
  password: string
}

const Login = () => {
  const [form] = Form.useForm<UserForm>()
  const { isPending: loginLoading, mutateAsync: login } = useMutation({
    mutationFn: async (info: UserForm) => {
      // eslint-disable-next-line no-console
      console.log(info)
      await delay(1000)
      return true
    },
  })

  return (
    <Form
      form={form}
      name="Login"
      layout="vertical"
      autoComplete="off"
      className="w-300px"
      onFinish={async (values) => {
        await login(values)
      }}
    >
      <Form.Item<UserForm>
        name="username"
        rules={[
          { required: true, message: 'Please input your username!' },
        ]}
      >
        <Input
          maxLength={30}
          prefix={<i className="i-ic:sharp-person text-text-placeholder" />}
          placeholder="Username"
        />
      </Form.Item>

      <Form.Item<UserForm>
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
        ]}
      >
        <Input.Password
          maxLength={30}
          prefix={<i className="i-ic:outline-lock text-text-placeholder" />}
          placeholder="Password / Phone Number"
          autoComplete="on"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          block
          loading={loginLoading}
          htmlType="submit"
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Login
