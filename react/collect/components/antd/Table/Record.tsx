import { cloneElement, isValidElement, type ReactNode, useState } from 'react'

export interface RecordProps {
  children: ReactNode
  trigger: ReactNode
}

export interface RecordChildrenProps {
  visible?: boolean
  close?: () => void
}

export const Record = ({ children, trigger }: RecordProps) => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      {isValidElement(trigger) ? cloneElement(trigger, { onClick: () => setVisible(true) } as any) : trigger}
      {isValidElement(children) ? cloneElement(children, { visible, close: () => setVisible(false) } as RecordChildrenProps) : children}
    </>
  )
}
