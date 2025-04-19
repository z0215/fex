import { dirname } from 'node:path'
import { mkdir, writeFile as originWriteFile } from 'node:fs/promises'

/**
 * Writes content to a file, creating any necessary directories in the path.
 *
 * @example
 * // Example usage:
 * const filePath = 'path/to/file.txt';
 * const content = 'Hello, world!';
 * const encoding = 'utf-8';
 *
 * writeFile(filePath, content, encoding)
 *   .then(() => {
 *     console.log('File written successfully.');
 *   })
 *   .catch((error) => {
 *     console.error('Error writing file:', error);
 *   });
 */
export const writeFile = async (filePath: string, content = '', encoding: BufferEncoding = 'utf-8') => {
  await mkdir(dirname(filePath), { recursive: true })
  return originWriteFile(filePath, content, encoding)
}
