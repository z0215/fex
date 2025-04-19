import type { MentionProps as AntdMentionProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'
import useFetchOptions from '../useFetchOptions'

export interface MentionsProps extends BasicSchemaFormItem<AntdMentionProps> {}

const Mentions: BFC<MentionsProps> = ({ formItemOptions, componentOptions, fetchOptions }) => {
  const { data, loading } = useFetchOptions(fetchOptions)

  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdMentions options={data} loading={loading} {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Mentions
