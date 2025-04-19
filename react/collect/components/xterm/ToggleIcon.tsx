import type { ButtonProps, TooltipProps } from 'antd'
import type { ReactNode } from 'react'
import { Button, Tooltip } from 'antd'
import { useMemo, useState } from 'react'
import { classNames, isUndefined } from '~/shared'

interface ToggleIconProps {
  icon: ReactNode
  defaultChecked?: boolean
  checked?: boolean
  disabled?: boolean
  size?: ButtonProps['size']
  onChange?: (checked: boolean) => void
  title?: TooltipProps['title']
}

const ToggleIcon = ({
  defaultChecked,
  checked,
  disabled,
  icon,
  size = 'small',
  onChange,
  title,
}: ToggleIconProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = useMemo(
    () => (isUndefined(checked) ? internalChecked : checked),
    [checked, internalChecked],
  )

  return (
    <Tooltip title={title}>
      <Button
        icon={icon}
        type="text"
        size={size}
        disabled={disabled}
        className={classNames({ 'bg-fill': isChecked })}
        onClick={() => {
          setInternalChecked(!isChecked)
          onChange?.(!isChecked)
        }}
      />
    </Tooltip>
  )
}

export default ToggleIcon
