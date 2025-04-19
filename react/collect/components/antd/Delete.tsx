import type { ReactNode } from 'react'
import {
  Button,
  type ButtonProps,
  Input,
  Modal,
  type ModalProps,
  Popconfirm,
  type PopconfirmProps,
  Tooltip,
  type TooltipProps,
  Typography,
} from 'antd'
import { cloneElement, isValidElement, useRef, useState } from 'react'
import type { GetRef } from '~/shared'
import { Icon } from '~/shared'

export interface DeletePorps extends Omit<PopconfirmProps, 'title'> {
  target?: string
  confirmInput?: string
  title?: PopconfirmProps['title']
  button?: ButtonProps
  tooltip?: TooltipProps
}

/**
 * @example
 * <Delete
 *   target="Test"
 *   onConfirm={async () => {
 *     await delay(3000)
 *   }}
 * />
 *
 * <Delete
 *   target="Test"
 *   confirmInput="Confirm Text"
 *   onConfirm={async () => {
 *     await delay(3000)
 *   }}
 * />
 */
export const Delete = ({
  target,
  confirmInput,
  children,
  button,
  tooltip,
  ...props
}: DeletePorps) => {
  const inputRef = useRef<GetRef<typeof Input>>(null)
  const [confirmText, setConfirmText] = useState('')
  return (
    <Popconfirm
      title={`Are you sure to delete this ${target}?`}
      description={
        confirmInput
          ? (
              <>
                <Typography.Paragraph>
                  Type
                  {' '}
                  <strong>{confirmInput}</strong>
                  {' '}
                  confirmation to delete
                </Typography.Paragraph>
                <Input
                  ref={inputRef}
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                />
              </>
            )
          : null
      }
      okType="danger"
      okText="Delete"
      cancelText="No"
      okButtonProps={{
        disabled: Boolean(confirmInput && confirmText !== confirmInput),
      }}
      {...props}
      onCancel={(e) => {
        props.onCancel?.(e)
        setConfirmText('')
      }}
      onConfirm={async (e) => {
        await props.onConfirm?.(e)
        setConfirmText('')
      }}
    >
      {children ?? (
        <span>
          <Tooltip title={button?.children ? undefined : tooltip?.title ?? 'Delete'} {...tooltip}>
            <Button danger icon={<Icon type="Delete" />} {...button} />
          </Tooltip>
        </span>
      )}
    </Popconfirm>
  )
}

export interface DeleteModalPorps extends ModalProps {
  target?: string
  confirmInput?: string
  button?: ButtonProps
  tooltip?: TooltipProps
  onConfirm?: () => void
  trigger?: ReactNode
}
const DeleteModal = ({
  target,
  confirmInput,
  button,
  tooltip,
  onConfirm,
  children,
  trigger,
  ...props
}: DeleteModalPorps) => {
  const inputRef = useRef<GetRef<typeof Input>>(null)
  const [loading, setLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [visible, setVisible] = useState(false)
  return (
    <>
      {trigger !== undefined
        ? isValidElement(trigger) ? cloneElement(trigger, { onClick: () => setVisible(true) } as any) : trigger
        : (
            <span>
              <Tooltip title={button?.children ? undefined : tooltip?.title ?? 'Delete'} {...tooltip}>
                <Button
                  danger
                  icon={<Icon type="Delete" />}
                  {...button}
                  onClick={(e) => {
                    button?.onClick?.(e)
                    setVisible(true)
                  }}
                />
              </Tooltip>
            </span>
          )}
      <Modal
        title={`Are you sure to delete this ${target}?`}
        okText="Delete"
        cancelText="No"
        open={visible}
        okButtonProps={{
          disabled: Boolean(confirmInput && confirmText !== confirmInput),
          danger: true,
          loading,
        }}
        destroyOnClose
        {...props}
        onOk={async (e) => {
          try {
            setLoading(true)
            props.onOk?.(e)
            await onConfirm?.()
            setVisible(false)
          }
          finally {
            setLoading(false)
          }
        }}
        onCancel={(e) => {
          props.onCancel?.(e)
          setVisible(false)
        }}
        afterClose={() => {
          setConfirmText('')
          props.afterClose?.()
        }}
        centered
        classNames={{
          body: 'max-h-70vh overflow-y-auto no-scroll-bar',
          header: 'm-r-base',
        }}
      >
        {confirmInput
          ? (
              <>
                <Typography.Paragraph>
                  Type
                  {' '}
                  <strong>{confirmInput}</strong>
                  {' '}
                  confirmation to delete
                </Typography.Paragraph>
                <Input
                  ref={inputRef}
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                />
              </>
            )
          : null}
        {children}
      </Modal>
    </>
  )
}

/**
 * @example
 * <Delete.Modal
 *   target="Test"
 *   onConfirm={async () => {
 *     await delay(3000)
 *   }}
 * />
 *
 * <Delete.Modal
 *   target="Test"
 *   confirmInput="Confirm Text"
 *   onConfirm={async () => {
 *     await delay(3000)
 *   }}
 * />
 */
Delete.Modal = DeleteModal
