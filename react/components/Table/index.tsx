import type { HTMLAttributes } from 'react'
import { cn } from '~/utils/core'

export const TableRow = (props: HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <tr {...props} />
  )
}

export const TableCell = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td className={cn('box-border border-b-1px border-l-0 border-r-1px border-t-0 border-border border-solid last:border-r-0 p-2 text-sm', className)} {...props} />
  )
}

export const TableHeaderCell = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th className={cn('box-border border-b-1px border-l-0 border-r-1px border-t-0 border-border border-solid last:border-r-0 p-2 text-sm', className)} {...props} />
  )
}

export const TableHeader = (props: HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead className="text-left" {...props} />
  )
}

export const TableBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <tbody className={cn('[&>tr:last-child>td]:border-b-0', className)} {...props} />
  )
}

export const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => {
  return (
    <table className={cn('w-full table-fixed border-1px border-border rounded-md border-solid', className)} cellSpacing={0} {...props} />
  )
}
