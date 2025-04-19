import type { Nil, StringLiteralUnion } from '../types'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { uid } from '../utils'
import { getTarget, type Target } from './getTarget'
import { useEvent } from './useEvent'
import { useMemoFn } from './useMemoFn'

export type FileAccept =
  | '*'
  | 'audio/*'
  | 'video/*'
  | 'image/*'
  | '.gif'
  | '.jpg'
  | '.png'
  | '.svg'
  | '.docx'
  | '.xlsx'
  | '.pdf'

export interface FileItem {
  id: string
  url: string
  file: File
}

export interface UseFilesOptions {
  onChange?: (files: FileItem[] | undefined) => void
  dragArea?: Target<HTMLElement>
  /**
   * @default false
   */
  allowPaste?: boolean
  /**
   * @default false
   */
  multiple?: boolean
  /**
   * @default ['*']
   */
  accept?: StringLiteralUnion<FileAccept>[]
  maxSize?: number
  minSize?: number
  maxLength?: number
}

/**
 * @example
 * const { open, remove, clear, files, isDragActive } = useFiles({
 *   multiple: true,
 * })
 */
export const useFiles = (options?: UseFilesOptions) => {
  const {
    onChange,
    dragArea,
    allowPaste = true,
    multiple = false,
    accept = ['*'],
    maxSize,
    minSize,
    maxLength,
  } = options ?? {}

  const [files, setFiles] = useState<FileItem[]>([])
  useEffect(() => {
    onChange?.(files)
  }, [files])

  const getFiles = useMemoFn(async (files: FileList | Nil) => {
    if (!files)
      return []

    const fileList = Array.from(files).filter((file) => {
      const isMax = maxSize ? file.size <= maxSize : true
      const isMin = minSize ? file.size > minSize : true
      const validateSize = isMax && isMin

      const validateType = accept.some((type) => {
        if (type === '*')
          return true

        if (type === file.type)
          return true

        if (file.name.endsWith(type))
          return true

        if (type.includes('*')) {
          return file.type.includes(type.replace('*', ''))
        }

        return false
      })

      return validateSize && validateType
    })

    const promises = fileList.slice(0, maxLength).map((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise<FileItem>((resolve) => {
        reader.addEventListener('load', () => {
          resolve({
            id: uid(),
            url: reader.result as string,
            file,
          })
        })
      })
    })

    return Promise.all(promises)

    // const dataTransfer = new DataTransfer()
    // const length = Math.min(fileList.length, maxLength)
    // for (const i of Array.from({ length }, (_, i) => i)) {
    //   dataTransfer.items.add(fileList[i])
    // }
    // return dataTransfer.files
  })

  const open = useMemoFn(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = multiple
    input.accept = accept.join(',')
    input.click()
    return new Promise<void>((resolve) => {
      input.addEventListener('change', async () => {
        const userFiles = await getFiles(input.files)
        setFiles(files.concat(userFiles).slice(0, maxLength))
        resolve()
      })
    })
  })

  const remove = useMemoFn((id: string) => {
    setFiles(produce((draft) => {
      const index = draft.findIndex(d => d.id === id)
      if (index <= -1)
        return
      draft.splice(index, 1)
    }))
  })

  const clear = useMemoFn(() => {
    setFiles([])
  })

  useEvent(document, 'paste', async (e) => {
    if (!allowPaste)
      return
    const userFiles = await getFiles(e.clipboardData?.files)
    setFiles(files.concat(userFiles).slice(0, maxLength))
  })

  const [isDragActive, setIsDragActive] = useState(false)
  useEvent(getTarget(dragArea), 'dragenter', (e) => {
    e.preventDefault()
    setIsDragActive(true)
  })
  useEvent(getTarget(dragArea), 'dragleave', (e) => {
    e.preventDefault()
    setIsDragActive(false)
  })
  useEvent(getTarget(dragArea), 'dragover', (e) => {
    e.preventDefault()
  })
  useEvent(getTarget(dragArea), 'drop', async (e) => {
    e.preventDefault()
    const userFiles = await getFiles(e.dataTransfer?.files)
    setFiles(files.concat(userFiles).slice(0, maxLength))
    setIsDragActive(false)
  })

  return {
    open,
    remove,
    clear,
    files,
    isDragActive,
  }
}
