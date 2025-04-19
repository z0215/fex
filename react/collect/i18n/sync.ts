import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import colors from 'picocolors'
import { $ } from 'zx'
import { chunk } from 'lodash-es'
import type { ObjectType } from './_utils'
import { getBaseFile, getDirname, getI18nDir } from './_utils'

const baseFile = getBaseFile()

const removeLine = async (line: number, path: string) => await $`sed -i '' '${line}d' ${path}`
const addLine = async (line: number, content: string, path: string) =>
  await $`sed -i '' '${line}i\\
${content}
' ${path}`

const writeDiffFile = (content: ObjectType) => {
  const __dirname = getDirname(import.meta.url)
  const diffDir = `${__dirname}/local/`
  if (!existsSync(diffDir))
    mkdirSync(diffDir)

  const filename = 'diff.json'
  writeFileSync(`${diffDir}${filename}`, JSON.stringify(content, null, 2), { encoding: 'utf-8' })
}

const syncI18nFile = async () => {
  // https://github.com/google/zx/blob/main/src/util.ts#L31
  // custom quote function
  $.quote = (arg: string) => arg

  const diffMap: Record<string, any> = {}
  const i18nList = await getI18nDir()
  for await (const dir of i18nList) {
    const baseDir = `src/${dir.path}`
    const { stdout } = await $`git diff -U0 ${baseDir}/${baseFile}.json`
    if (!stdout)
      continue

    const diffMapKey = dir.path === 'plugins/i18n' ? 'common' : dir.path.split('/').at(-2) as string
    diffMap[diffMapKey] = {}

    const diffList = chunk(stdout.split('@@').slice(1), 2)
    let preNum = 0
    const i18nFiles = readdirSync(baseDir).filter(name => name.endsWith('json') && name !== `${baseFile}.json`)
    for await (const [header, content] of diffList) {
      const [originState, newState] = header.trim().split(' ')
      const [originLineString, originCountString] = originState.split(',')
      const originLine = Number.parseInt(originLineString.slice(1))
      const originCount = Number.parseInt(originCountString)
      const [newLineString] = newState.split(',')
      const newLine = Number.parseInt(newLineString.slice(1))
      const line = originCount === 0
        ? newLine
        : originLine + preNum
      let appendIndex = line
      const changeList = content.split('\n').filter(Boolean)
      for await (const item of changeList) {
        const [type] = item
        const content = item.slice(1)
        if (type === '-') {
          for await (const i18nFile of i18nFiles)
            await removeLine(line, `./${baseDir}/${i18nFile}`)

          preNum--
        }

        else if (type === '+') {
          for await (const i18nFile of i18nFiles)
            await addLine(appendIndex, content, `./${baseDir}/${i18nFile}`)

          appendIndex++
          preNum++
          const [key, value] = content.trim().split(':')
          diffMap[diffMapKey][key.replace(/\"/g, '')] = value.trim().replace(/[",]/g, '')
        }
      }
    }
  }

  writeDiffFile(diffMap)
}

export default {
  desc: `Synchronous ${baseFile} file changes to other i18n files, and collect untranslated fields and generate files to ${colors.underline('scripts/i18n/local')}`,
  handle: async () => {
    try {
      await syncI18nFile()
      console.log(colors.green('Synchronization succeeded'))
    }
    catch (error) {
      console.error(colors.red(error as string))
    }
  },
}
