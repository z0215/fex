import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { TransferProps as AntdTransferProps } from 'antd'
import { useFetchOptions, FetchOptions, BaseOptionType } from '../shared/useFetchOptions'

interface CustomTransferProps extends AntdTransferProps<BaseOptionType> {
  value?: string[]
}

const CustomTransfer: FC<CustomTransferProps> = ({ value, ...transferProps }) => {
  return (
    <AntdTransfer
      rowKey={(record) => record.value}
      showSearch
      render={(item) => item.label}
      listStyle={{
        flex: 1,
        maxHeight: 350,
      }}
      targetKeys={value}
      {...transferProps}
    />
  )
}

export interface TransferProps extends BasicSchemaFormItem<AntdTransferProps<BaseOptionType>> {
  fetchOptions?: FetchOptions
}

const Transfer: FC<TransferProps> = ({ formItemProps, componentProps, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemProps}>
      <CustomTransfer disabled={loading} dataSource={data} {...componentProps} />
    </AntdForm.Item>
  )
}

export default Transfer
