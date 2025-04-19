import { cwd } from 'node:process'
import { resolve } from 'node:path'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import type { Answers } from 'prompts'
import prompts from 'prompts'
import colors from 'picocolors'
import getI18nDir from './getI18nDir'
import getLanguages from './getLanguages'

const rootPath = resolve(cwd(), 'src')
const i18nPath = resolve(rootPath, 'i18n')
const languages = getLanguages(i18nPath)

type PromptsType = 'handle' | 'language' | 'confirm'
interface HandleItem {
  title: string
  value: string
  fn: (res: Answers<PromptsType>) => void
}

const handleList: HandleItem[] = [
  {
    title: 'Add',
    value: 'add',
    async fn({ language }) {
      const i18nDirList = await getI18nDir(rootPath)

      i18nDirList.forEach(async (path) => {
        const i18nPath = resolve(rootPath, path, 'i18n')
        const target = await readFile(resolve(i18nPath, `en-US.json`), 'utf-8')
        writeFile(resolve(i18nPath, `${language}.json`), target, 'utf-8')
      })
    },
  },
  {
    title: 'Remove',
    value: 'remove',
    async fn({ language, confirm }) {
      if (!confirm)
        return

      const i18nDirList = await getI18nDir(rootPath)
      i18nDirList.forEach(async (path) => {
        const i18nPath = resolve(rootPath, path, 'i18n', `${language}.json`)
        await unlink(i18nPath)
      })
    },
  },
]

try {
  const response = await prompts<PromptsType>(
    [
      {
        type: 'select',
        name: 'handle',
        message: 'Operation',
        choices: handleList,
      },
      {
        type: (prev) => {
          if (prev === 'add')
            return 'text'
          if (prev === 'remove')
            return 'select'
          return null
        },
        name: 'language',
        message: 'Language',
        choices: languages.map(item => ({
          title: item,
          value: item,
        })),
        validate: (value) => {
          if (!value.length)
            return 'Please enter the language'

          if (languages.includes(value))
            return `The ${value} already exists, duplication is not allowed`

          return true
        },
      },
      {
        type: (_, values) => (values.handle === 'remove' ? 'confirm' : null),
        name: 'confirm',
        message: (_, values) => `Do you want to delete ${values.language}?`,
      },
    ],
    {
      onCancel: () => {
        throw new Error(`${colors.red('✖')} Operation cancelled`)
      },
    },
  )

  const currentHandle = handleList.find(h => h.value === response.handle)

  currentHandle.fn(response)
}
catch (error) {
  console.log((error as ErrorEvent).message)
}
