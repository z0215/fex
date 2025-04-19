import type { RateProps as AntdRateProps } from 'antd'
import type { BasicSchemaFormItem } from '../SchemaFormItem'

export interface RateProps extends BasicSchemaFormItem<AntdRateProps> {}

const Rate: BFC<RateProps> = ({ formItemOptions, componentOptions }) => {
  return (
    <AntdForm.Item {...formItemOptions}>
      <AntdRate {...componentOptions} />
    </AntdForm.Item>
  )
}

export default Rate
