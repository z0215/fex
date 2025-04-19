import type { SizeType } from 'antd/es/config-provider/SizeContext'
import { Button } from 'antd'
import { capitalize, Icon } from '~/shared'
import { Dropdown } from '../Dropdown'
import { sizes } from './useTableSize'

export interface SizePickerProps {
  size?: SizeType
  onChange?: (size: SizeType) => void
}

export const SizePicker = ({ size, onChange }: SizePickerProps) => {
  return (
    <Dropdown
      menu={{
        items: sizes.map(size => ({ key: size, label: capitalize(size) })),
        selectable: true,
        selectedKeys: [size as string],
        onClick({ key }) {
          onChange?.(key as SizeType)
        },
      }}
    >
      <Button type="text" icon={<Icon type="Size" />} size={size} />
    </Dropdown>
  )
}
