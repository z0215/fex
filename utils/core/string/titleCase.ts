import { capitalize } from './capitalize'

/**
 * @example
 * titleCase('hello world') // => 'Hello World'
 * titleCase('hello.world') // => 'Hello World'
 * titleCase('hello-world') // => 'Hello World'
 * titleCase('helloWorld') // => 'Hello World'
 */
export const titleCase = (str: string, splitter: string | RegExp = /(?=[A-Z])|[.\-\s_]/) => str.split(splitter).map(s => capitalize(s.toLowerCase())).join(' ')
