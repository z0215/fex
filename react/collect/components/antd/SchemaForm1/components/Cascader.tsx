import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { CascaderProps as AntdCascaderProps } from 'antd'
import { useFetchOptions, FetchOptions } from '../shared/useFetchOptions'

export interface CascaderProps extends BasicSchemaFormItem<AntdCascaderProps> {
  fetchOptions?: FetchOptions
}

const Cascader: FC<CascaderProps> = ({ formItemProps, componentProps, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemProps}>
      <AntdCascader options={data} loading={loading} disabled={loading} {...componentProps} />
    </AntdForm.Item>
  )
}

export default Cascader
