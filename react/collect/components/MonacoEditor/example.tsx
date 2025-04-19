import { useState } from 'react'
import { MonacoEditor } from '.'

const Example = () => {
  const [code, setCode] = useState('')
  return (
    <div className="h-full flex gap-2">
      <MonacoEditor value={code} onChange={setCode} className="w-50%" />

      <div className="flex-1">{code}</div>
    </div>
  )
}

export default Example
