import type { SizeType } from 'antd/es/config-provider/SizeContext'
import { Button } from 'antd'
import { Icon } from '~/shared'
import { Dropdown } from '../Dropdown'

export interface ColumnsPickerProps {
  size?: SizeType
  onChange?: () => void
}

export const ColumnsPicker = ({ size }: ColumnsPickerProps) => {
  return (
    <Dropdown
      menu={{
        // items: [].map(size => ({ key: size, label: capitalize(size) })),
        selectable: true,
        // selectedKeys: [size as string],
        // onClick({ key }) {
        //   onChange?.(key as SizeType)
        // },
      }}
    >
      <Button type="text" icon={<Icon type="Settings" />} size={size} />
    </Dropdown>
  )
}
