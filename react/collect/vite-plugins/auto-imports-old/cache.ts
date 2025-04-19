import { dirname, resolve } from 'node:path'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { cwd } from 'node:process'
import { $safeJsonParse } from '../../shared'
import type { ExportedInfo } from './ast'

const cacheDir = resolve(cwd(), 'node_modules', '.auto-imports')

const getTargetPath = (name: string) => resolve(cacheDir, `${name}.json`)

export const getCache = async (name: string) => {
  const targetPath = getTargetPath(name)
  if (!existsSync(targetPath))
    return

  const content = await readFile(targetPath, 'utf-8')
  return $safeJsonParse<ExportedInfo>(content)
}

export const setCache = async (name: string, data: ExportedInfo) => {
  const targetPath = getTargetPath(name)
  await mkdir(dirname(targetPath), { recursive: true })
  writeFile(targetPath, JSON.stringify(data, null, 2), 'utf-8')
}
