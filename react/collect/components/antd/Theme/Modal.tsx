import type { FormItemProps, ModalProps } from 'antd'
import type { Color } from 'antd/es/color-picker'
import type { ReactNode } from 'react'
import type { ThemeToken } from './useThemeToken'
import { Button, ColorPicker, Form, InputNumber, Modal, Space } from 'antd'
import { useMemo } from 'react'
import { debounce, useMemoFn } from '~/shared'
import { defaultToken, useThemeToken } from './useThemeToken'

interface TokenItemProps<T> extends Omit<FormItemProps<T>, 'name'> {
  onResetToken?: (name: ThemeTokenName) => void
  name: ThemeTokenName
}

const TokenItem = ({
  label,
  onResetToken,
  name,
  ...props
}: TokenItemProps<ThemeToken>) => {
  const [token] = useThemeToken()

  const isDiff = useMemo(
    () => {
      if (!onResetToken)
        return false

      const value = token[name]
      const defaultValue = defaultToken[name]

      return value !== defaultValue
    },
    [name, onResetToken, token],
  )

  return (
    <Form.Item label={label}>
      <Space>
        <Form.Item
          noStyle
          name={name}
          {...props}
        >
          {props.children}
        </Form.Item>
        {isDiff && (
          <Button type="link" onClick={() => onResetToken?.(name)}>
            Reset
          </Button>
        )}
      </Space>
    </Form.Item>
  )
}

type ThemeTokenName = keyof ThemeToken

interface TokenColor {
  label: ReactNode
  name: ThemeTokenName
}

const defaultColors: TokenColor[] = [
  {
    label: 'Brand Color',
    name: 'colorPrimary',
  },
  // {
  //   label: 'Text Color',
  //   name: 'colorText',
  // },
  // {
  //   label: 'Background Color',
  //   name: 'colorBgLayout',
  // },
]

interface TokenSize {
  label: ReactNode
  name: ThemeTokenName
  min: number
  max: number
}

const defaultSizes: TokenSize[] = [
  // {
  //   label: 'Border Radius',
  //   name: 'borderRadius',
  //   min: 0,
  //   max: 16,
  // },
  // {
  //   label: 'Font Size',
  //   name: 'fontSize',
  //   min: 12,
  //   max: 32,
  // },
]

interface TokenModalProps extends ModalProps {
  colors?: TokenColor[]
  sizes?: TokenSize[]
}

export const TokenModal = ({
  colors,
  sizes,
  ...props
}: TokenModalProps) => {
  const [token, setToken] = useThemeToken()
  const [tokenForm] = Form.useForm<ThemeToken>()
  const resetToken = useMemoFn((name: ThemeTokenName) => {
    setToken({ ...token, [name]: defaultToken[name] })
    const id = setTimeout(() => {
      tokenForm.resetFields([name])
      clearTimeout(id)
    })
  })
  const onValuesChange = useMemoFn(debounce((value: any) => {
    setToken(value)
  }))
  return (
    <Modal
      footer={null}
      {...props}
    >
      <Form
        form={tokenForm}
        onValuesChange={onValuesChange}
        labelCol={{ span: 8 }}
        labelAlign="left"
      >
        {(colors ?? defaultColors).map(({ label, name }) => (
          <TokenItem
            key={name}
            label={label}
            name={name}
            getValueFromEvent={(color: Color) => color.toHexString()}
            onResetToken={resetToken}
            initialValue={defaultToken[name]}
          >
            <ColorPicker />
          </TokenItem>
        ))}
        {(sizes ?? defaultSizes).map(({ label, name, min, max }) => (
          <TokenItem
            key={name}
            label={label}
            name={name}
            onResetToken={resetToken}
          >
            <InputNumber min={min} max={max} />
          </TokenItem>
        ))}
      </Form>
    </Modal>
  )
}
