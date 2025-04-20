import { Button, Checkbox, Space, Switch } from 'antd'
import { cloneElement, useState } from 'react'
import { AutoLoading, delay } from '~/shared'

const Page = () => {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  return (
    <Space>
      <AutoLoading trigger="onClick">
        <Button onClick={async () => {
          await delay(1000)
        }}
        >
          Test
        </Button>
      </AutoLoading>

      <AutoLoading>
        <Switch
          checked={checked1}
          onChange={async (checked) => {
            await delay(1000)
            setChecked1(checked)
          }}
        />
      </AutoLoading>

      <AutoLoading customLoading={() => <i className="i-line-md:loading-loop" />}>
        <Checkbox
          checked={checked2}
          onChange={async ({ target }) => {
            await delay(1000)
            setChecked2(target.checked)
          }}
        >
          Custom Loading
        </Checkbox>
      </AutoLoading>

      <AutoLoading
        customLoading={target => (
          <>
            {cloneElement(target, { children: undefined })}
            <i className="i-line-md:loading-loop p-l-8px" />
          </>
        )}
      >
        <Checkbox
          checked={checked3}
          onChange={async ({ target }) => {
            await delay(1000)
            setChecked3(target.checked)
          }}
        >
          Custom Loading
        </Checkbox>
      </AutoLoading>
    </Space>
  )
}

export default Page
