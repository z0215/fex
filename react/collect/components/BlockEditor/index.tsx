import type { DependencyList } from 'react'
import { locales } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import { useEffect, useRef } from 'react'
import '@blocknote/react/style.css'

export interface BlockEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  deps?: DependencyList
  className?: string
}

const locale = locales.en

export const BlockEditor = ({ value = '', placeholder, deps, onChange, className }: BlockEditorProps) => {
  const editorValue = useRef<string>(null)
  const isUpdatingFromValue = useRef(false)

  const editor = useCreateBlockNote(
    {
      initialContent: value ? JSON.parse(value) : undefined,
      dictionary: {
        ...locale,
        placeholders: {
          ...locale.placeholders,
          emptyDocument: placeholder,
          default: '',
        },
      },
    },
    deps,
  )
  useEffect(() => {
    if (value === editorValue.current || !value) {
      return
    }
    isUpdatingFromValue.current = true
    editor.replaceBlocks(editor.document, JSON.parse(value))
    editorValue.current = value
    const timerId = setTimeout(() => {
      clearTimeout(timerId)
      isUpdatingFromValue.current = false
    }, 0)
  }, [value])

  return (
    <BlockNoteView
      editor={editor}
      slashMenu={false}
      sideMenu={false}
      onChange={() => {
        if (isUpdatingFromValue.current)
          return

        const newValue = JSON.stringify(editor.document)
        if (newValue === editorValue.current)
          return
        editorValue.current = newValue
        onChange?.(newValue)
      }}
      theme="light"
      className={className}
    />
  )
}
