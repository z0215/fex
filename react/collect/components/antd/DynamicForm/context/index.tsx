import type { FC } from 'react'
import type { FieldData } from '../type'

export interface IDynamicFormContext {
  formData: Record<string, any>
  setFields: (fields: Array<FieldData>) => void
  disableExprMode: boolean
  componentsMap?: {
    [name: string]: FC
  }
}

const context = createContext<IDynamicFormContext>({
  formData: {},
  setFields: _noop,
  disableExprMode: false,
})

export const { Provider: DynamicFormProvider } = context

export function useDynamicForm() {
  const { formData, setFields, disableExprMode, componentsMap } = useContext(context)

  return {
    formData,
    setFields,
    disableExprMode,
    componentsMap,
  }
}
