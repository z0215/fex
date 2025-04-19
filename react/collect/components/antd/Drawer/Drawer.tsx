import type { DrawerProps as ADrawerProps } from 'antd'
import type { UseDrawerOptions } from './useDrawer'
import { Drawer as ADrawer } from 'antd'
import { useDrawer } from './useDrawer'

export interface DrawerProps extends ADrawerProps {
  /**
   * @default true
   */
  resizable?: UseDrawerOptions['resizable']
}

export const Drawer = ({
  placement = 'right',
  resizable = true,
  width,
  height,
  open,
  ...props
}: DrawerProps) => {
  const drawerProps = useDrawer({
    placement,
    resizable,
    width,
    height,
    open,
  })

  return (
    <ADrawer
      {...drawerProps}
      {...props}
      placement={placement}
      open={open}
      footer={(
        <>
          {props.footer}
          {drawerProps.footer}
        </>
      )}
      title={(
        <>
          {drawerProps.title}
          {props.title}
        </>
      )}
      styles={{
        body: { ...drawerProps.styles?.body, ...props.styles?.body },
        wrapper: {
          ...drawerProps.styles?.wrapper,
          ...props.styles?.wrapper,
        },
        footer: {
          padding: props.footer ? undefined : drawerProps.styles?.footer?.padding,
        },
        ...props.styles,
      }}
    >
      {drawerProps.children}
      {props.children}
    </ADrawer>
  )
}
