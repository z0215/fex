import { readdirSync } from 'node:fs'
import colors from 'picocolors'

const getLanguages = (i18nPath: string) => {
  try {
    const fileList = readdirSync(i18nPath, 'utf-8')
    const languages = fileList
      .filter(name => name.endsWith('.json'))
      .map(name => name.replace('.json', ''))
    return languages
  }
  catch (error) {
    console.error(colors.yellow((error as Error).message))
    return []
  }
}

export default getLanguages
