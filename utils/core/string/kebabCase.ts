/**
 * @example
 * kebabCase('hello world') // => 'hello-world'
 * kebabCase('hello.world') // => 'hello-world'
 * kebabCase('hello_world') // => 'hello-world'
 * kebabCase('helloWorld') // => 'hello-world'
 */
export const kebabCase = (str: string, splitter: string | RegExp = /(?=[A-Z])|[.\-\s_]/) => str.split(splitter).join('-').toLowerCase()
