/**
 * @example
 * await delay(1000)
 * console.log('Executed after 1 second')
 */
export const delay = (timeout = 300) => new Promise<void>((resolve) => {
  const id = setTimeout(() => {
    resolve()
    clearTimeout(id)
  }, timeout)
})
