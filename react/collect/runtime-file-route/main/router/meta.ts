import { useLoaderData } from 'react-router-dom'

export interface PageMeta {
  visible: boolean
  layout: LayoutType
  // Menu options
  label: string
  isMenu: boolean
  icon?: string
  order?: number
  enable?: boolean
  defaultEnable?: boolean
}

export const definePageMeta = (pageMeta: PageMeta) => pageMeta

export const usePageMeta = () => useLoaderData() as (PageMeta | null)
