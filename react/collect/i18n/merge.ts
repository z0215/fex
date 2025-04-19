import { readdirSync } from 'node:fs'
import colors from 'picocolors'
import fse from 'fs-extra'
import { getDirname, getI18nDir } from './_utils'
import type { ObjectType } from './_utils'

export default {
  desc: 'Automatically merge translated files to i18n files',
  handle: async () => {
    try {
      const __dirname = getDirname(import.meta.url)
      const diffDir = `${__dirname}/local/`
      const i18nList = await getI18nDir()
      const languages = readdirSync(diffDir).filter(name => name !== 'diff.json')
      languages.forEach((language) => {
        const translatedContent = fse.readJsonSync(`${diffDir}/${language}`)
        Object.entries(translatedContent).forEach(([key, value]) => {
          const targetDirType = key === 'common' ? 'plugins' : key
          const targetDir = i18nList.find(dir => dir.path.includes(targetDirType))
          if (!targetDir)
            return
          const targetPath = `${targetDir.fullPath}/${language}`
          const untranslateContent = fse.readJsonSync(targetPath)
          Object.entries(value as ObjectType).forEach(([translatedKey, translatedValue]) => {
            untranslateContent[translatedKey] = translatedValue
          })
          fse.writeJsonSync(targetPath, untranslateContent, { replacer: null, spaces: 2 })
        })
      })
      console.log(colors.green('Merge succeeded'))
    }
    catch (error) {
      console.error(colors.red(error as string))
    }
  },
}
