import type { TransferProps as AntdTransferProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import type { BaseOptionType } from '../useFetchOptions'
import useFetchOptions from '../useFetchOptions'

interface CustomTransferProps extends AntdTransferProps<BaseOptionType> {
  value?: string[]
}

const CustomTransfer: BFC<CustomTransferProps> = ({ value, ...transferProps }) => {
  return (
    <AntdTransfer
      rowKey={record => record.value}
      showSearch
      render={item => item.label}
      listStyle={{
        flex: 1,
        maxHeight: 350,
      }}
      targetKeys={value}
      {...transferProps}
    />
  )
}

export interface TransferProps extends BasicSchemaFormItem<AntdTransferProps<BaseOptionType>> {}

const Transfer: BFC<TransferProps> = ({ formItemOptions, componentOptions, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemOptions}>
      <CustomTransfer disabled={loading} dataSource={data} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Transfer
