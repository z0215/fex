import type { AutoCompleteProps as AntdAutoCompleteProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import useFetchOptions from '../useFetchOptions'

export interface AutoCompleteProps extends BasicSchemaFormItem<AntdAutoCompleteProps> {}

const AutoComplete: BFC<AutoCompleteProps> = ({ formItemOptions, componentOptions, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdAutoComplete options={data} disabled={loading} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default AutoComplete
