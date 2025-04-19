import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import { useEffect, useRef } from 'react'

let id = 0
const uid = () => `${id++}`

export interface MonacoEditorProps extends monacoEditor.editor.IStandaloneEditorConstructionOptions {
  onChange?: (value: string, event: monacoEditor.editor.IModelContentChangedEvent) => void
  onMount?: (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => void
  className?: string
}

export const MonacoEditor = ({
  onChange,
  onMount,
  className,
  language = 'txt',
  value = '',
  theme = 'vs',
  model,
  ...props
}: MonacoEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const uri = monacoEditor.Uri.parse(`${uid()}.${language}`)
    const internalModel
      = monacoEditor.editor.getModel(uri) ?? monacoEditor.editor.createModel(value, language, uri)
    const editor = (editorRef.current = monacoEditor.editor.create(containerRef.current, {
      automaticLayout: true,
      fontSize: 14,
      tabSize: 2,
      scrollbar: {
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6,
      },
      language,
      value,
      theme,
      model: model ?? internalModel,
      ...props,
    }))
    onMount?.(editor, monacoEditor)
    const subscription = editor.onDidChangeModelContent((event) => {
      onChange?.(editor.getValue(), event)
    })
    editor.addCommand(monacoEditor.KeyMod.CtrlCmd | monacoEditor.KeyCode.KeyS, () => {
      editor.getAction?.('editor.action.formatDocument')?.run()
    })
    return () => {
      editor.dispose()
      subscription.dispose()
    }
  }, [])

  // Update Value
  useEffect(() => {
    if (!editorRef.current) {
      return
    }
    if (value === editorRef.current.getValue()) {
      return
    }
    const model = editorRef.current.getModel()
    editorRef.current.pushUndoStop()
    model?.pushEditOperations(
      null,
      [
        {
          range: model.getFullModelRange(),
          text: value,
        },
      ],
      () => null,
    )
    editorRef.current.pushUndoStop()
  }, [value])

  // Update Options
  useEffect(() => {
    editorRef.current?.updateOptions(props)
  }, [props])

  // Update Model
  useEffect(() => {
    model && editorRef.current?.setModel(model)
  }, [model])

  // Update Language
  useEffect(() => {
    const model = editorRef.current?.getModel()
    model && monacoEditor.editor.setModelLanguage(model, language)
  }, [language])

  // Update Theme
  useEffect(() => {
    monacoEditor.editor.setTheme(theme)
  }, [theme])

  return <div ref={containerRef} className={className} />
}
