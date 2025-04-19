import { isBlob } from '../core'

/**
 * @example
 * download('test.md', 'http://localhost:9527/test.md')
 *
 * const data = [
 *  { id: 'ID', name: '姓名', age: '年龄' },
 *  { id: 1, name: '张三', age: 18 },
 *  { id: 2, name: '李四', age: 22 },
 *  { id: 3, name: '王五', age: 26 },
 * ]
 * const result = data.map(v => (`${v.id}\t${v.name}\t${v.age}`)).join('\n')
 * download('test.xls', new Blob([result]))
 */
export const download = (name: string, data: string | Blob) => {
  const href = isBlob(data) ? URL.createObjectURL(data) : data
  const link = document.createElement('a')
  link.href = href
  link.download = name
  link.click()
  const timer = setTimeout(() => {
    if (isBlob(data)) {
      URL.revokeObjectURL(href)
    }
    link.remove()
    clearTimeout(timer)
  })
}
