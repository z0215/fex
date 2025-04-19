import type { FC } from 'react'
import { defaultFormatMap, timeTypes } from './components/constant'
import { DynamicFormProvider, useDynamicForm } from './context'
import ArrayComponent from './components/Array'
import AutoComplete from './components/AutoComplete'
import Checkbox from './components/Checkbox'
import Collapse from './components/Collapse'
import DatePicker from './components/DatePicker'
import DateTimePicker from './components/DateTimePicker'
import Input from './components/Input'
import NumberInput from './components/NumberInput'
import PureText from './components/PureText'
import Radio from './components/Radio'
import Row from './components/Row'
import Select from './components/Select'
import Switch from './components/Switch'
import Tab from './components/Tab'
import TextArea from './components/TextArea'
import TimePicker from './components/TimePicker'
import type { AllComponents, BasicComponent, FieldData } from './type'

export const registerComponents = () => {
  return {
    PureText,
    Input,
    TextArea,
    NumberInput,
    AutoComplete,
    Select,
    Radio,
    Checkbox,
    Switch,
    DatePicker,
    TimePicker,
    DateTimePicker,
    Collapse,
    Array: ArrayComponent,
    Tab,
    Row,
  }
}

export const validateDsl = (dsl: Array<AllComponents>) => {
  const log = (msg: string) => {
    console.error(`[DynamicForm][ValidateForm Error]: ${msg}`)
  }
  if (!Array.isArray(dsl)) {
    log(`Form Json Object Must Be an Array`)
    return false
  }
  return true
}

export const renderItem = (
  cm: AllComponents,
  cmMap: ReturnType<typeof registerComponents>,
  formData: Record<string, any>,
  extraName?: Array<string | number>
) => {
  if (!_has(cmMap, cm.type)) {
    return (
      <AntdForm.Item label={`Unknown Component Type ${cm.type}`}>
        Please check Your Json Object
      </AntdForm.Item>
    )
  }
  if (_has(cm, 'condition')) {
    const { key, value } = (cm as BasicComponent).condition ?? {}
    if (key && _get(formData, key) !== value) {
      return null
    }
  }
  const Component = cmMap[cm.type as keyof typeof cmMap]
  const cmName = _get(cm, 'name')
  const name = extraName ? [...extraName, cmName].filter((cv) => !_isNil(cv)) : cmName
  const rules = _get(cm, 'required') === true ? [{ required: true }] : []
  return (
    <AntdAlert.ErrorBoundary
      description={`Open devtool and switch to Console tab for detail`}
      message={`Something wrong when render component ${cm.type}`}
    >
      <Component rules={rules} {...(cm as any)} name={name} />
    </AntdAlert.ErrorBoundary>
  )
}

export const useRenderFormItem = ({
  dsl,
  extraName,
  formData,
}: {
  dsl?: Array<AllComponents>
  extraName?: Array<string | number>
  formData: any
}) => {
  const cmMap = useMemo(() => registerComponents(), [])
  return useMemo(() => {
    if (!dsl) {
      return null
    }
    if (!validateDsl(dsl)) {
      return (
        <AntdResult
          status={'error'}
          title={'Validate Form Failed'}
          subTitle={'Please open devtools(F12 or cmd+opt+i) and switch to Console tab for detail'}
        />
      )
    }
    return dsl.map((cv, index) => {
      const content = renderItem(cv, cmMap, formData, extraName)
      if (content) {
        return cloneElement(content, { key: `${cv.type}-${index}` })
      }
      return null
    })
  }, [cmMap, dsl, extraName, formData])
}

export const FormItems: React.FC<{
  dsl?: Array<AllComponents>
  extraName?: Array<string | number>
  formStyle?: React.CSSProperties
}> = ({ dsl, extraName, formStyle }) => {
  const { formData } = useDynamicForm()
  const formItemContent = useRenderFormItem({
    dsl,
    extraName,
    formData,
  })

  return useMemo(
    () => (
      <div className="dynamic-form-container" style={formStyle}>
        {formItemContent}
      </div>
    ),
    [formItemContent, formStyle]
  )
}

export const useRenderForm = ({
  dsl,
  extraName,
  disableExpr,
  disabled,
  componentsMap,
}: {
  dsl?: Array<AllComponents>
  extraName?: string[]
  disableExpr?: boolean
  disabled?: boolean
  componentsMap?: {
    [name: string]: FC
  }
}) => {
  const [form] = AntdForm.useForm()
  const [formData, setFormData] = useState<any>()
  const initialValues = useMemo(() => {
    if (!dsl) {
      return
    }
    if (!validateDsl(dsl)) {
      return
    }
    const getValues: (dsl: Array<AllComponents>) => Record<string, any> = (dsl) => {
      return dsl.reduce((acc, cur) => {
        if (cur.type === 'Step') {
          return acc
        } // todo 等这个组件完成之后这里的逻辑需要重写
        if (cur.type === 'Collapse') {
          return {
            ...acc,
            ...getValues(cur.options?.children ?? []),
          }
        }
        if (cur.type === 'Tab') {
          const children = Array.isArray(cur.options?.children) ? cur.options?.children : []
          const v = children?.reduce((values, tabPanel) => {
            return {
              ...values,
              ...getValues(tabPanel.children ?? []),
            }
          }, {} as Record<string, any>)
          return {
            ...acc,
            ...v,
          }
        }
        if (cur.type === 'Row') {
          const cols = Array.isArray(cur.options?.cols) ? cur.options?.cols : []
          const v = cols?.reduce((values, col) => {
            return {
              ...values,
              ...getValues(col.children ?? []),
            }
          }, {} as Record<string, any>)
          return {
            ...acc,
            ...v,
          }
        }
        return {
          ...acc,
          [cur.name]: timeTypes.includes(cur.type) ? dayjs(cur.value) : cur.value,
        }
      }, {} as Record<string, any>)
    }
    return getValues(dsl)
  }, [dsl])
  useEffect(() => {
    if (initialValues && !_isEqual(initialValues, formData)) {
      setFormData(initialValues)
      form.setFieldsValue(initialValues)
    }
  }, [form, initialValues])
  const setFormDataWithImmerWrapper = useMemoizedFn((fields: Array<FieldData>) => {
    setFormData((p: any) => {
      // 过滤相同设置（antd 表单同一修改会触发多次）
      const newFields = fields.reduce<Array<FieldData>>((prev, curr) => {
        const { name, value } = curr
        const oldVal = _get(p, [..._castArray(name)])

        if (oldVal !== value) {
          return [...prev, curr]
        }
        return prev
      }, [])

      if (!newFields.length) {
        return p
      }
      return produce(p, (draft: any) => {
        fields.forEach(({ name, value }) => {
          _set(draft, [..._castArray(name)], value)
        })
      })
    })
  })
  const setFields = useMemoizedFn((fields: Array<FieldData>) => {
    setFormDataWithImmerWrapper(fields)
    form.setFields(fields)
  })
  const content = useMemo(() => {
    return (
      <DynamicFormProvider
        value={{ formData, setFields, disableExprMode: disableExpr ?? false, componentsMap }}
      >
        <AntdForm
          layout="vertical"
          initialValues={initialValues}
          preserve={false}
          form={form}
          disabled={disabled}
          onFieldsChange={(changedFields) => setFormDataWithImmerWrapper(changedFields)}
        >
          <FormItems dsl={dsl} extraName={extraName} />
        </AntdForm>
      </DynamicFormProvider>
    )
  }, [dsl, extraName, form, formData, initialValues])
  const getFormatString = useMemoizedFn((name: string) => {
    if (!dsl) {
      return
    }
    if (!validateDsl(dsl)) {
      return
    }
    const cm = dsl
      ?.filter((cv) => cv.type !== 'Collapse' && cv.type !== 'Step')
      .find((cm) => (cm as BasicComponent).name === name)
    if (!cm) {
      return
    }
    if (!timeTypes.includes(cm.type)) {
      return
    }
    return (cm as BasicComponent)?.options?.submitFormat ?? _get(defaultFormatMap, cm.type)
  })
  const submitData = useMemo(() => {
    return _keys(formData).reduce((acc, cur) => {
      return {
        ...acc,
        [cur]: dayjs.isDayjs(formData[cur])
          ? formData[cur].format(getFormatString(cur))
          : formData[cur],
      }
    }, formData)
  }, [formData, getFormatString])
  return {
    content,
    form,
    formData,
    submitData,
    setFields,
  }
}
