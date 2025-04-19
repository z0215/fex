import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { AutoCompleteProps as AntdAutoCompleteProps } from 'antd'
import { useFetchOptions, FetchOptions } from '../shared/useFetchOptions'

export interface AutoCompleteProps extends BasicSchemaFormItem<AntdAutoCompleteProps> {
  fetchOptions?: FetchOptions
}

const AutoComplete: FC<AutoCompleteProps> = ({ formItemProps, componentProps, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemProps}>
      <AntdAutoComplete options={data} disabled={loading} {...componentProps} />
    </AntdForm.Item>
  )
}

export default AutoComplete
