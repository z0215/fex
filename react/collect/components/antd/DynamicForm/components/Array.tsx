import type { NamePath } from 'antd/es/form/interface'
import type { IArray } from '../type'
import { FormItems } from '../index'
import './index.css'

const context = createContext<{ prefixName?: NamePath }>({})

const { Provider } = context

export const useArrayContext = () => {
  return useContext(context)
}

const ArrayComponent: React.FC<IArray> = ({ options, name, ...rest }) => {
  const { children = [] } = options ?? {}
  const { prefixName = [] } = useArrayContext()
  const fullName = useMemo(
    () => [..._castArray(prefixName), ..._castArray(name)],
    [name, prefixName]
  )
  return (
    <Provider value={{ prefixName: fullName }}>
      <AntdForm.Item {...rest}>
        <AntdForm.List name={name}>
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map((field, index) => {
                  return (
                    <div key={field.key}>
                      <AntdSpace className={'Array'} size={4}>
                        <FormItems dsl={children} extraName={[field.name]}></FormItems>
                        <AntdForm.Item>
                          <AntdButton danger type="link" onClick={() => remove(field.name)}>
                            <DeleteOutlined />
                          </AntdButton>
                        </AntdForm.Item>
                      </AntdSpace>
                      {index !== fields.length - 1 && children.length > 1 && (
                        <AntdDivider style={{ marginTop: 0 }} />
                      )}
                    </div>
                  )
                })}
                <AntdForm.ErrorList errors={errors} />
                <AntdForm.Item>
                  <AntdButton type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
                    {options?.wording?.addButtonWording ?? 'Add Field'}
                  </AntdButton>
                </AntdForm.Item>
              </>
            )
          }}
        </AntdForm.List>
      </AntdForm.Item>
    </Provider>
  )
}

export default ArrayComponent
