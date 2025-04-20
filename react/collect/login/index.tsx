import {
  Flex,
  Segmented,
  theme,
} from 'antd'
import { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'

const Page = () => {
  const [value, setValue] = useState('Login')
  const { token } = theme.useToken()
  return (
    <Flex vertical justify="center" align="center" gap={token.margin} className="h-screen">
      <Segmented options={['Login', 'Sign Up']} value={value} onChange={setValue} />
      {value === 'Login' ? <Login /> : <SignUp onDone={() => setValue('Login')} />}
    </Flex>
  )
}

export default Page
