import type { SizeType } from 'antd/es/config-provider/SizeContext'
import { useLocalStorage } from '~/shared'

export const sizes = ['small', 'middle', 'large']

export const useTableSize = (id: string, defaultSize: SizeType) => {
  const [size = defaultSize, setSize] = useLocalStorage<SizeType>(`table-size-${id}`)
  return [size, setSize] as const
}
