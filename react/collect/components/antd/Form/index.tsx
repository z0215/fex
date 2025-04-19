import type { FormProps as AntdFormProps, FormInstance } from 'antd'
import SchemaForm from './SchemaForm'
import type { SchemaFormItemProps } from './SchemaFormItem'
import { datePickerFormatMap, dateRangePickerFormatMap } from './SchemaFormItem'

export interface FormProps extends AntdFormProps {
  loading?: boolean
  schema?: string | SchemaFormItemProps[]
  schemaKey?: string
  onMont?: (form: FormInstance) => void
}

const Form: BFCC<FormProps> = ({
  loading,
  children,
  schema: userSchema,
  schemaKey,
  onMont,
  ...formConfig
}) => {
  const id = useId()
  const { data: remoateSchema, isFetching: getSchemaLoading } = useQuery({
    queryKey: [`getSchemaBy${id}`, schemaKey],
    queryFn: () => {
      const list = [
        { type: 'Input', formItemOptions: { label: 'Input', name: 'Input' } },
        { type: 'Checkbox', formItemOptions: { label: 'Checkbox', name: 'Checkbox' }, componentOptions: {
          options: [
            {
              label: 'A',
              value: 'a',
            },
            {
              label: 'B',
              value: 'b',
            },
          ],
        } },
      ]
      return mockApi('object array', { length: 2, converter(index) {
        return list[index || 0]
      } })
    },
    enabled: Boolean(schemaKey),
  })
  const internalSchema = useMemo(() => {
    try {
      const schema = remoateSchema ?? userSchema
      const result = typeof schema === 'string' ? JSON.parse(schema) : schema || []
      return result as SchemaFormItemProps[]
    }
    catch {
      return []
    }
  }, [userSchema, remoateSchema])

  const getFieldInfo = useAhooksMemoizedFn((key: string) => {
    const currentComponent = internalSchema.find(item => item.formItemOptions?.name === key)
    if (!currentComponent)
      return

    const { type, format } = currentComponent as SchemaFormItemProps & { format: string }
    const formatMap = { ...datePickerFormatMap, ...dateRangePickerFormatMap } as Record<string, string>
    const formatStr = formatMap[type] || format
    return {
      isDatePicker: Object.keys(datePickerFormatMap).includes(type),
      isDateRangePicker: Object.keys(dateRangePickerFormatMap).includes(type),
      formatStr,
    }
  })

  const formatDayjs = useAhooksMemoizedFn((key: string, value: any) => {
    const info = getFieldInfo(key)
    if (!info)
      return value

    const format = (value: string) => _isString(value) ? dayjs(value, info.formatStr) : _isUndefined(value) ? dayjs() : value

    if (info.isDatePicker)
      return format(value)

    if (info.isDateRangePicker)
      return Array.isArray(value) ? value.map(v => format(v)) : [dayjs(), dayjs()]

    return value
  })

  const formatDayjsString = useAhooksMemoizedFn((key: string, value: any) => {
    const info = getFieldInfo(key)
    if (!info)
      return value

    const format = (value: any) => dayjs.isDayjs(value) ? value.format(info.formatStr) : value

    if (info.isDatePicker)
      return format(value)

    if (info.isDateRangePicker && Array.isArray(value))
      return value.map(v => format(v))

    return value
  })

  const formatInternalSchema = useMemo(() => {
    return internalSchema.map((item) => {
      return {
        ...item,
        formItemOptions: {
          ...item.formItemOptions,
          initialValue: formatDayjs(item.formItemOptions?.name, item.formItemOptions?.initialValue),
        },
      }
    })
  }, [internalSchema, formatDayjs])

  const [form] = AntdForm.useForm()
  useEffect(() => {
    const proxyFormInstance = new Proxy(form, {
      get(target, property, receiver) {
        const originFn = Reflect.get(target, property, receiver)

        if (property === 'setFields') {
          return (fields: { name: string, value: any }[]) => {
            const formatedValue = fields.map((item) => {
              return {
                ...item,
                value: formatDayjs(item.name, item.value),
              }
            })
            originFn(formatedValue)
          }
        }

        if (property === 'setFieldValue') {
          return (key: string, value: any) => {
            originFn(key, formatDayjs(key, value))
          }
        }

        if (property === 'setFieldsValue') {
          return (values: Record<string, any>) => {
            const result = Object.entries(values).reduce((res, [key, value]) => {
              res[key] = formatDayjs(key, value)
              return res
            }, {} as Record<string, any>)
            originFn(result)
          }
        }

        if (property === 'validateFields') {
          return async () => {
            const values = await originFn()
            const result = Object.entries(values).reduce((res, [key, value]) => {
              res[key] = formatDayjsString(key, value)
              return res
            }, {} as Record<string, any>)
            return result
          }
        }

        return originFn
      },
    })
    onMont?.(proxyFormInstance)
  }, [onMont, form, formatDayjsString, formatDayjs])

  return (
    <AntdSkeleton active loading={loading || getSchemaLoading}>
      <AntdForm layout="vertical" {...formConfig} form={formConfig.form ?? form}>
        {userSchema || schemaKey ? <SchemaForm schema={formatInternalSchema} /> : children}
      </AntdForm>
    </AntdSkeleton>
  )
}

export default Form
