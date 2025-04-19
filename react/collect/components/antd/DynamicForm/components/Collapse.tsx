import React from 'react'
import type { ICollapse } from '../type'
import { FormItems } from '../index'

const Collapse: React.FC<ICollapse> = ({ options, label, name, ...rest }) => {
  const { children = [] } = options ?? {}
  // name may be passed down from another component, keep passing it down
  return (
    <AntdCollapse
      style={{ marginBottom: 24 }}
      bordered={false}
      defaultActiveKey={'children'}
      {...rest}
    >
      <AntdCollapse.Panel key={'children'} header={label}>
        <FormItems dsl={children} extraName={name ? _castArray(name) : undefined}></FormItems>
      </AntdCollapse.Panel>
    </AntdCollapse>
  )
}

export default Collapse
