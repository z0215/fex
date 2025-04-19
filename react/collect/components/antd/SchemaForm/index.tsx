import type { FormProps } from 'antd'
import type { SchemaItem } from './Item'
import { Form, Skeleton } from 'antd'
import { useMemo } from 'react'
import { isArray } from '~/shared'
import { Render } from './Render'

export interface Schema<T> extends SchemaFormProps<T> {
  items?: SchemaItem<T>[]
}

const isSchema = <T,>(value: any): value is Schema<T> => !isArray(value)

export interface SchemaFormProps<T> extends FormProps<T> {
  loading?: boolean
  schema?: Schema<T> | SchemaItem<T>[]
}

export const SchemaForm = <T,>({
  loading,
  schema,
  ...props
}: SchemaFormProps<T>) => {
  const { items, ...options } = useMemo<Schema<T>>(() => {
    return isSchema<T>(schema)
      ? { ...schema, ...props }
      : {
          ...props,
          items: schema,
        }
  }, [props, schema])

  return (
    <Form
      layout="vertical"
      className="h-full w-full"
      {...options}
    >
      <Skeleton active loading={loading} className="h-full w-full">
        <Render items={items} />
      </Skeleton>
    </Form>
  )
}
