import { camelCase } from './camelCase'
import { capitalize } from './capitalize'

/**
 * @example
 * camelCase('hello world') // => 'HelloWorld'
 * camelCase('hello-world') // => 'HelloWorld'
 * camelCase('hello.world') // => 'HelloWorld'
 * camelCase('hello_world') // => 'HelloWorld'
 */
export const pascalCase = (str: string) => capitalize(camelCase(str))
