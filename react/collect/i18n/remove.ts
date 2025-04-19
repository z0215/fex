import type { Answers } from 'prompts'
import colors from 'picocolors'
import { remove as removeFile } from 'fs-extra'
import { getI18nDir } from './_utils'

export default {
  desc: 'Remove a language, Automatically sync for each i18n directory',
  handle: async <T extends Answers<string>>({ language, confirm }: T) => {
    try {
      if (!confirm)
        return
      const i18nList = await getI18nDir()
      i18nList.forEach((dir) => {
        removeFile(`${dir.fullPath}/${language}.json`)
      })
      console.log(colors.green(`Successfully deleted ${language}`))
    }
    catch (error) {
      console.error(colors.red(error as string))
    }
  },
}
