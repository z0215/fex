import { useMutation } from '@tanstack/react-query'
import {
  Button,
  Flex,
  Form,
  Input,
  List,
  Popover,
  Space,
  theme,
  Tooltip,
  Typography,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { AutoLoading, delay, useMemoFn } from '~/shared'

interface UserForm {
  username: string
  password: string
  phoneNumber: number
  verificationCode: number
}

const useTimer = (initTime = 30) => {
  const [time, setTime] = useState(initTime)
  const [isStart, setIsStart] = useState(false)
  const start = useMemoFn(() => {
    setIsStart(true)
  })
  useEffect(() => {
    if (!isStart)
      return
    const timer = setInterval(() => {
      if (time <= 0) {
        clearInterval(timer)
        setIsStart(false)
        setTime(initTime)
        return
      }
      setTime(time - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isStart, time])
  return {
    isStart,
    time,
    start,
  }
}

const SignUp = ({ onDone }: { onDone: () => void }) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm<UserForm>()
  const password = Form.useWatch('password', form)
  const [focusedPassword, setFocusedPassword] = useState(false)
  const passwordSuggestions = useMemo(() => {
    return [
      { label: 'Including lowercase letters', reg: /(?=.*[a-z])/ },
      { label: 'Including uppercase letters', reg: /(?=.*[A-Z])/ },
      { label: 'Including numbers', reg: /(?=.*\d)/ },
      {
        label: (
          <Space>
            <Typography.Text>Including special symbols</Typography.Text>
            <Tooltip title={`!@#$%^&*()_+{}[]):;<>,.?~\\/-`}>
              <i className="i-ic:outline-help-outline text-text-placeholder" />
            </Tooltip>
          </Space>
        ),
        reg: /(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-])/,
      },
      { label: 'At least 8 characters', reg: /.{8,}/ },
    ]
  }, [])
  const { time, start, isStart } = useTimer()

  const { isPending: signUpLoading, mutateAsync: signUp } = useMutation({
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
      name="Sign Up"
      layout="vertical"
      autoComplete="off"
      className="w-300px"
      onFinish={async (values) => {
        await signUp(values)
        onDone()
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
        validateTrigger={['onBlur', 'onChange']}
        validateFirst
        rules={[
          { required: true, message: 'Please input your password!' },
          {
            validateTrigger: 'onBlur',
            async validator(_, value) {
              if (passwordSuggestions.every(item => item.reg.test(value)))
                return

              throw new Error('The password format is incorrect')
            },
          },
        ]}
      >
        <Input.Password
          maxLength={20}
          prefix={(
            <Popover
              open={focusedPassword}
              placement="left"
              content={(
                <List
                  size="small"
                  split={false}
                  dataSource={passwordSuggestions}
                  renderItem={item => (
                    <List.Item className="p-0px!">
                      <Space>
                        {item.reg.test(password || '')
                          ? <i className="i-ic:baseline-check text-success" />
                          : <i className="i-ic:baseline-close text-error" />}
                        <Typography.Text>{item.label}</Typography.Text>
                      </Space>
                    </List.Item>
                  )}
                />
              )}
            >
              <i className="i-ic:outline-lock text-text-placeholder" />
            </Popover>
          )}
          placeholder="Password"
          autoComplete="on"
          onFocus={() => setFocusedPassword(true)}
          onBlur={() => setFocusedPassword(false)}
        />
      </Form.Item>

      <Form.Item noStyle>
        <Flex gap={token.margin}>
          <Form.Item<UserForm>
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please input your phone number!' },
            ]}
            className="flex-1"
          >
            <Input
              type="number"
              prefix={<i className="i-ic:round-phone-iphone text-text-placeholder" />}
              placeholder="Phone Number"
            />
          </Form.Item>

          <AutoLoading trigger="onClick">
            <Button onClick={async () => {
              if (isStart)
                return
              const { phoneNumber } = await form.validateFields(['phoneNumber'])
              // eslint-disable-next-line no-console
              console.log(phoneNumber)
              await await delay(1000)
              start()
            }}
            >
              {isStart ? `${time}s` : 'Send'}
            </Button>
          </AutoLoading>
        </Flex>
      </Form.Item>

      <Form.Item<UserForm>
        name="verificationCode"
        rules={[
          { required: true, message: 'Please input your verification code!' },
        ]}
      >
        <Input
          type="number"
          placeholder="Verification Code"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          block
          loading={signUpLoading}
          htmlType="submit"
        >
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SignUp
