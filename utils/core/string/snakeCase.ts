/**
 * @example
 * snakeCase('hello world') // => 'hello_world'
 * snakeCase('hello.world') // => 'hello_world'
 * snakeCase('hello-world') // => 'hello_world'
 * snakeCase('helloWorld') // => 'hello_world'
 */
export const snakeCase = (str: string, splitter: string | RegExp = /(?=[A-Z])|[.\-\s_]/) => str.split(splitter).join('_').toLowerCase()
