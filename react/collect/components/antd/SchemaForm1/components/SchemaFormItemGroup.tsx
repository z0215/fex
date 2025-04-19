import type { FC } from 'react'
import { SchemaFormContext } from '../shared/context'

export interface SchemaFormItemGroupProps {
  prefix: string | number | (string | number)[]
  children: React.ReactNode
}

const SchemaFormItemGroup: FC<SchemaFormItemGroupProps> = ({ prefix, children }) => {
  const prefixPath = useContext(SchemaFormContext)
  const concatPath = useMemo(() => [...prefixPath, ..._castArray(prefix)], [prefixPath, prefix])

  return <SchemaFormContext.Provider value={concatPath}>{children}</SchemaFormContext.Provider>
}

export default SchemaFormItemGroup
