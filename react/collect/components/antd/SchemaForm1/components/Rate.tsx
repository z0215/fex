import type { FC } from 'react'
import { BasicSchemaFormItem } from './SchemaFormItem'
import type { RateProps as AntdRateProps } from 'antd'

export interface RateProps extends BasicSchemaFormItem<AntdRateProps> {}

const Rate: FC<RateProps> = ({ formItemProps, componentProps }) => {
  return (
    <AntdForm.Item {...formItemProps}>
      <AntdRate {...componentProps} />
    </AntdForm.Item>
  )
}

export default Rate
