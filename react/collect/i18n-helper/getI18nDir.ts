import readdirp from 'readdirp'
import { unionBy } from 'lodash-es'

const getI18nDir = async (rootPath: string) => {
  const i18nEntrys = await readdirp.promise(rootPath, {
    fileFilter: ({ path }) => {
      const [dirname, filename] = path.split('/').slice(-2)
      const isI18n = dirname === 'i18n' && filename.endsWith('.json')
      return isI18n
    },
  })

  const i18nDirList = i18nEntrys
    .map(entry => entry.path.replace(/i18n\/(.*)\.json$/, ''))

  return unionBy(i18nDirList)
}

export default getI18nDir
