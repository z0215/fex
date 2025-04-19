import { capitalize } from './capitalize'

/**
 * @example
 * camelCase('hello world') // => 'helloWorld'
 * camelCase('hello-world') // => 'helloWorld'
 * camelCase('hello.world') // => 'helloWorld'
 * camelCase('hello_world') // => 'helloWorld'
 */
export const camelCase = (str: string, splitter: string | RegExp = /[.\-\s_]/) => {
  const result = str.split(splitter).reduce((acc, part) => `${acc}${capitalize(part)}`)
  return `${result.charAt(0).toLowerCase()}${result.slice(1)}`
}
