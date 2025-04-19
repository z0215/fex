import type { ColumnType } from 'antd/es/table'
import { Button, Checkbox, Flex } from 'antd'
import { useMemo, useState } from 'react'
import { Icon, isEqual, isFunction, isString } from '~/shared'

/**
 * @example
 * const [columns] = useDynamicColumns<DataItem>([
 *   {
 *     title: 'Name',
 *     dataIndex: 'name',
 *     key: 'name',
 *   },
 * ])
 * <Table columns={columns} />
 */

export const useDynamicColumns = <T,>(initColumns: ColumnType<T>[]) => {
  const restColumns = useMemo(() => initColumns.slice(0, -1), [initColumns])
  const [internalColumns, setInternalColumns] = useState(restColumns)
  const filters = useMemo(
    () => restColumns
      .map(({ title, key, dataIndex }) => {
        if (isFunction(title))
          return false
        if (!isString(key) || !isString(dataIndex))
          return false
        return { text: title, value: (dataIndex ?? key) }
      })
      .filter(i => i !== false),
    [restColumns],
  )
  const defaultChecks = useMemo(() => filters.map(({ value }) => value), [filters])
  const [checkboxValues, setCheckboxValues] = useState<string[]>(defaultChecks)
  const actionColumn = useMemo<ColumnType<T>>(() => {
    const lastColumn = initColumns.at(-1)
    return {
      filters,
      filterSearch: true,
      filterIcon: <Icon type="Settings" />,
      filterDropdown({ close }) {
        return (
          <div>
            <div className="p-xs">
              <Checkbox.Group value={checkboxValues} onChange={setCheckboxValues} style={{ display: 'block' }}>
                <div>
                  {filters.map(({ text, value }) => (
                    <div key={value} className="rounded-base p-x-xs p-y-xxs hover:bg-layout">
                      <Checkbox value={value} className="w-full">{text}</Checkbox>
                    </div>
                  ))}
                </div>
              </Checkbox.Group>
            </div>
            <div className="border-b-1px border-b-secondary border-b-solid" />
            <Flex justify="space-between" className="p-xs">
              <Button
                type="link"
                size="small"
                disabled={isEqual(defaultChecks, checkboxValues)}
                onClick={() => setCheckboxValues(defaultChecks)}
              >
                Reset
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  const cols = restColumns.map(col => ({
                    ...col,
                    hidden: !checkboxValues.includes((col.key || col.dataIndex) as string),
                  }))
                  setInternalColumns(cols)
                  close()
                }}
              >
                OK
              </Button>
            </Flex>
          </div>
        )
      },
      ...lastColumn,
    }
  }, [checkboxValues, defaultChecks, filters, initColumns, restColumns])
  const columns = useMemo(() => internalColumns.concat(actionColumn), [actionColumn, internalColumns])
  return columns
}

// export const useColumns = <T,>(initColumns: ColumnType<T>[]) => {
//   const restColumns = useMemo(() => initColumns.slice(0, -1), [initColumns])
//   const filters = useMemo(
//     () =>
//       restColumns
//         .map(({ title, key, dataIndex }) => {
//           if (isFunction(title)) {
//             return false
//           }

//           if (!isString(key) || !isString(dataIndex)) {
//             return false
//           }

//           return { text: title, value: dataIndex ?? key }
//         })
//         .filter((i) => i !== false),
//     [restColumns]
//   )
//   const defaultChecks = useMemo(() => filters.map(({ value }) => value), [filters])
//   const [visibleColumns = [], setVisibleColumns] = useLocalStorageState<string[]>('service-columns',{defaultValue:defaultChecks})
//   const [checkboxValues, setCheckboxValues] = useState<string[]>(visibleColumns)
//   const actionColumn = useMemo<ColumnType<T>>(() => {
//     const lastColumn = initColumns.at(-1)
//     return {
//       filters,
//       filterSearch: true,
//       filterIcon: <SettingOutlined />,
//       filterDropdown({ close }) {
//         return (
//           <div>
//             <div className="p-xs">
//               <Checkbox.Group
//                 value={checkboxValues}
//                 onChange={setCheckboxValues}
//                 style={{ display: 'block' }}
//               >
//                 <div>
//                   {filters.map(({ text, value }) => (
//                     <div key={value} className="rounded-base p-x-xs p-y-xxs hover:bg-layout">
//                       <Checkbox value={value} className="w-full">
//                         {text}
//                       </Checkbox>
//                     </div>
//                   ))}
//                 </div>
//               </Checkbox.Group>
//             </div>
//             <div className="border-b-1px border-b-secondary border-b-solid" />
//             <Flex justify="space-between" className="p-xs">
//               <Button
//                 type="link"
//                 size="small"
//                 disabled={isEqual(defaultChecks, checkboxValues)}
//                 onClick={() => setCheckboxValues(defaultChecks)}
//               >
//                 Reset
//               </Button>
//               <Button
//                 type="primary"
//                 size="small"
//                 onClick={() => {
//                   setVisibleColumns(checkboxValues)
//                   close()
//                 }}
//               >
//                 OK
//               </Button>
//             </Flex>
//           </div>
//         )
//       },
//       ...lastColumn,
//     }
//   }, [checkboxValues, defaultChecks, filters, initColumns])
//   const columns = useMemo(
//     () => {
//       return restColumns.map<ColumnType<T>>((col) => ({
//         ...col,
//         hidden: !visibleColumns.includes((col.key || col.dataIndex) as string),
//       })).concat(actionColumn)
//     },
//     [actionColumn]
//   )
//   return columns
// }
