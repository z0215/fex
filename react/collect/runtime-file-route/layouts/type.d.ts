import type { ReactNode } from 'react'

export {}

declare global {
  export interface LayoutProps {
    children: ReactNode
  }
  export type LayoutType = 'fullscreen' | 'dynamic'
}
