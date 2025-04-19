import type { ForwardRefRenderFunction } from 'react'
import type { FormProps, FormInstance } from 'antd'
import SchemaFormItem, {
  SchemaFormItemProps,
  datePickerFormatMap,
  dateRangePickerFormatMap,
} from './components/SchemaFormItem'

export interface SchemaFormProps {
  schema: SchemaFormItemProps[]
  formConfig?: FormProps
}

export type SchemaFormRef = FormInstance

const SchemaForm: ForwardRefRenderFunction<SchemaFormRef, SchemaFormProps> = (
  { schema, formConfig },
  ref,
) => {
  const [internalForm] = AntdForm.useForm()

  const getDefinedComponentByKey = useMemoizedFn((key: string) => {
    for (const s of schema) {
      if (s.items) {
        let itemsIndex: number = -1
        let formItemsIndex: number = -1
        itemsIndex = s.items
          ? s.items.findIndex((i) => {
              formItemsIndex = i.formItems
                ? i.formItems.findIndex((f) => f.formItemProps?.name === key)
                : -1
              return formItemsIndex !== -1
            })
          : -1

        return s.items[itemsIndex]?.formItems?.[formItemsIndex]
      }

      if (s.formItemProps?.name === key) {
        return s
      }
    }
  })

  const formatDayjs = useMemoizedFn((payload: { value: any; name?: string; type?: string }) => {
    const { name, type, value } = payload
    const definedComponent = getDefinedComponentByKey(name || '')
    const componentFormat = (definedComponent?.componentProps as any)?.format
    const componentType = type || definedComponent?.type || ''
    const formatMap = Object.assign({}, datePickerFormatMap, dateRangePickerFormatMap) as Record<
      string,
      string
    >
    const defaultComponentFormat = formatMap[componentType]
    const formatStr = componentFormat || defaultComponentFormat
    if (Object.keys(datePickerFormatMap).includes(componentType)) {
      return dayjs(value, _isString(value) ? formatStr : undefined)
    }
    if (Object.keys(dateRangePickerFormatMap).includes(componentType)) {
      if (Array.isArray(value)) {
        return value.map((v) => dayjs(v, _isString(v) ? formatStr : undefined))
      }
      return value
    }
    // 处理layout组件的情况，需要递归format
    if (_isPlainObject(value)) {
      return Object.entries(value).reduce((obj, [key, val]) => {
        obj[key] = formatDayjs({ name: key, value: val })
        return obj
      }, value)
    }
    return value
  })

  const formatStringByDayjs = useMemoizedFn((payload: { value: any; name: string }) => {
    const { name, value } = payload
    const definedComponent = getDefinedComponentByKey(name)
    const componentFormat = (definedComponent?.componentProps as any)?.format
    const componentType = definedComponent?.type as any

    const formatMap = Object.assign({}, datePickerFormatMap, dateRangePickerFormatMap) as Record<
      string,
      string
    >
    const defaultComponentFormat = formatMap[componentType]
    const formatStr = componentFormat || defaultComponentFormat

    if (Object.keys(datePickerFormatMap).includes(componentType)) {
      return dayjs.isDayjs(value) ? value.format(formatStr) : value
    }
    if (Object.keys(dateRangePickerFormatMap).includes(componentType)) {
      if (Array.isArray(value)) {
        return value.map((v) => (dayjs.isDayjs(v) ? v.format(formatStr) : v))
      }
      return value
    }
    // 处理layout组件的情况，需要递归format
    if (_isPlainObject(value)) {
      return Object.entries(value).reduce((obj, [key, val]) => {
        obj[key] = formatStringByDayjs({ name: key, value: val })
        return obj
      }, value)
    }
    return value
  })

  const formatDayjsByObject = useMemoizedFn(
    (payload: { values?: Record<string, any>; type?: string; pickKey?: string[] }) => {
      const { values, type, pickKey } = payload

      if (!values) return

      const list = Object.entries(values)

      if (pickKey?.length) {
        return list.reduce((obj, [key, value]) => {
          obj[key] = pickKey.includes(key)
            ? formatDayjs({
                name: key,
                value,
                type,
              })
            : value
          return obj
        }, values)
      }

      return list.reduce((obj, [key, value]) => {
        obj[key] = formatDayjs({
          name: key,
          value,
          type,
        })
        return obj
      }, values)
    },
  )

  const proxyFormInstance = new Proxy(internalForm, {
    get(target, property, receiver) {
      const originFn = Reflect.get(target, property, receiver)

      if (property === 'setFields') {
        return (fields: { name: string; value: any; [key: string]: any }[]) => {
          const formatedValue = fields.map((item) => {
            return {
              ...item,
              value: formatDayjs({ name: item.name, value: item.value }),
            }
          })
          originFn(formatedValue)
        }
      }

      if (property === 'setFieldValue') {
        return (name: string, value: any) => {
          originFn(name, formatDayjs({ name, value }))
        }
      }

      if (property === 'setFieldsValue') {
        return (values: Record<string, any>) => {
          originFn(formatDayjsByObject({ values }))
        }
      }

      if (property === 'validateFields') {
        return async () => {
          const values = await originFn()
          return Object.keys(values).reduce((obj, key) => {
            return {
              ...obj,
              [key]: formatStringByDayjs({ name: key, value: obj[key] }),
            }
          }, values)
        }
      }

      return originFn
    },
  })

  useImperativeHandle(ref, () => proxyFormInstance)

  return (
    <AntdForm
      layout="vertical"
      {...formConfig}
      initialValues={formatDayjsByObject({ values: formConfig?.initialValues })}
      form={internalForm}
    >
      {schema.map((s) => (
        <SchemaFormItem
          key={s.key || s.formItemProps?.name}
          {...s}
          formItemProps={formatDayjsByObject({
            type: s.type,
            values: s.formItemProps,
            pickKey: ['initialValue'],
          })}
          items={s.items?.map((item) => {
            return {
              ...item,
              formItems: item.formItems?.map((f) => {
                return {
                  ...f,
                  formItemProps: formatDayjsByObject({
                    type: f.type,
                    values: f.formItemProps,
                    pickKey: ['initialValue'],
                  }),
                }
              }),
            }
          })}
        />
      ))}
    </AntdForm>
  )
}

export default forwardRef(SchemaForm)
