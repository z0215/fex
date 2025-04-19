type Slash<T extends string> =
  T extends `${infer Head}\\${infer Tail}` ? `${Head}/${Slash<Tail>}` : T

/**
 * @example
 * const result = slash('path\\to\\file');
 * console.log(result); // Outputs: 'path/to/file'
 */
export const slash = <T extends string>(str: T) => str.replace(/\\/g, '/') as Slash<T>
