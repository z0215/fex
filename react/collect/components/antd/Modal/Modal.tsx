import type { ModalProps as AModalProps } from 'antd'
import { Modal as AModal } from 'antd'
import { useState } from 'react'
import { useModal, type UseModalOptions } from './useModal'

export interface ModalPorps extends AModalProps {
  /**
   * @default true
   */
  autoLoading?: boolean
  /**
   * @default true
   */
  draggable?: UseModalOptions['draggable']
  top?: UseModalOptions['top']
}

export const Modal = ({
  autoLoading = true,
  draggable = true,
  width,
  top,
  open,
  ...props
}: ModalPorps) => {
  const modalProps = useModal({
    width,
    top,
    open,
    draggable,
  })
  const [okLoading, setOkLoading] = useState(false)

  return (
    <AModal
      {...props}
      open={open}
      afterClose={() => {
        modalProps.afterClose?.()
        props.afterClose?.()
      }}
      title={modalProps.title(props.title)}
      style={{
        ...modalProps.style,
        ...props.style,
      }}
      modalRender={modal => modalProps.modalRender?.(props.modalRender?.(modal) ?? modal)}
      okButtonProps={{
        loading: okLoading,
        ...props.okButtonProps,
      }}
      onOk={async (e) => {
        if (!autoLoading)
          return props.onOk?.(e)

        try {
          setOkLoading(true)
          await props.onOk?.(e)
        }
        finally {
          setOkLoading(false)
        }
      }}
    />
  )
}
