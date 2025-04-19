import type { IRow } from '../type'
import { FormItems } from '../index'

const Row: React.FC<IRow> = ({ options, name }) => {
  const { cols = [], ...props } = options ?? {}
  return (
    <AntdRow gutter={4} {...props}>
      {cols.map((col, index) => {
        const { children = [], ...colProps } = col
        return (
          <AntdCol key={`${index}`} {...colProps}>
            <FormItems dsl={children} extraName={name ? _castArray(name) : undefined}></FormItems>
          </AntdCol>
        )
      })}
    </AntdRow>
  )
}

export default Row
