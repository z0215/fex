import { parentPort } from 'node:worker_threads'
import { generateType, getExportedInfo } from './ast.js'

parentPort.on('message', (files) => {
  const types = files.map((file) => {
    const { types } = getExportedInfo(file)
    const items = types.map(item => generateType(file, item))
    return items
  })
  parentPort.postMessage(types)
})
