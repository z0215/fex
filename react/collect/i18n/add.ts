import {
  readFileSync,
  writeFileSync,
} from 'node:fs'
import type { Answers } from 'prompts'
import colors from 'picocolors'
import { getBaseFile, getI18nDir } from './_utils'

export default {
  desc: 'Add a new language, Automatically sync for each i18n directory',
  handle: async <T extends Answers<string>>({ language }: T) => {
    try {
      const baseFile = getBaseFile()
      const i18nList = await getI18nDir()
      i18nList.forEach((dir) => {
        const originContent = readFileSync(`${dir.fullPath}/${baseFile}.json`, { encoding: 'utf-8' })
        writeFileSync(`${dir.fullPath}/${language}.json`, originContent, { encoding: 'utf-8' })
      })
      console.log(colors.green(`Successfully added ${language}`))
    }
    catch (error) {
      console.error(colors.red(error as string))
    }
  },
}
