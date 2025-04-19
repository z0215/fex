import type { TransferProps as ATransferProps } from 'antd'
import { Transfer as ATransfer } from 'antd'

export interface TransferProps<T> extends ATransferProps<T> {
  renderKey?: string
  itemKey?: string
  value?: string[]
}

export const Transfer = <T,>({
  value,
  renderKey,
  itemKey,
  ...props
}: TransferProps<T>) => {
  return (
    <ATransfer
      // @ts-expect-error support itemKey
      rowKey={record => record[itemKey ?? '']}
      // @ts-expect-error support renderKey
      render={item => item[renderKey ?? '']}
      targetKeys={value}
      {...props}
    />
  )
}
