import { useState } from 'react'
import { BlockEditor } from '.'

const Example = () => {
  const [code, setCode] = useState<string>()
  return (
    <div className="h-full flex gap-2">
      <BlockEditor value={code} onChange={setCode} placeholder="Code" className="w-50% border border-solid" />

      <div className="flex-1">
        <button
          type="button"
          onClick={() => {
            const data = code ? JSON.parse(code) : []
            data.push({
              type: 'paragraph',
              props: {
                textColor: 'default',
                backgroundColor: 'default',
                textAlignment: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: '111',
                  styles: {},
                },
              ],
              children: [],
            })
            setCode(JSON.stringify(data))
          }}
        >
          test
        </button>
        <div>{code}</div>
      </div>
    </div>
  )
}

export default Example
