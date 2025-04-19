import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { MentionProps as AntdMentionProps } from 'antd'
import { useFetchOptions, FetchOptions } from '../shared/useFetchOptions'

export interface MentionsProps extends BasicSchemaFormItem<AntdMentionProps> {
  fetchOptions?: FetchOptions
}

const Mentions: FC<MentionsProps> = ({ formItemProps, componentProps, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemProps}>
      <AntdMentions options={data} loading={loading} {...componentProps} />
    </AntdForm.Item>
  )
}

export default Mentions
