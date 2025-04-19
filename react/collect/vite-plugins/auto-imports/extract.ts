import { argv } from 'node:process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import { dependencies, devDependencies } from '../../package.json'
import { API_PATH, TYPE_PATH, getPkgDtsPath } from './path'
import { getExportedInfo } from './ast'

const writeJsonFile = async (path: string, content: any) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const filePath = resolve(__dirname, path)
  await mkdir(dirname(filePath), { recursive: true })
  writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')
}

const extract = (names: string[], args: Pick<Command, 'api' | 'type'>) => {
  names.forEach(async (name) => {
    const dtsPath = await getPkgDtsPath(name)
    const { values, types } = getExportedInfo(dtsPath)
    if (args.api) {
      writeJsonFile(`${API_PATH}/${name}.json`, values)
    }
    if (args.type) {
      writeJsonFile(`${TYPE_PATH}/${name}.json`, types)
    }
  })
}

interface Command {
  help?: boolean
  type?: boolean
  api?: boolean
  dependencies?: boolean
  devDependencies?: boolean
  pkg?: string
}

const helpMessage = `\
Usage: pnpm extract [-h | --help]
                    [-t | --type]
                    [-a | --api]
                    [-d | --dependencies]
                    [-D | --devDependencies]
                    [--pkg <name>...]`

;(() => {
  const args = minimist<Command>(argv.slice(2), {
    default: {
      help: false,
      type: false,
      api: false,
      dependencies: false,
      devDependencies: false,
    },
    alias: {
      h: 'help',
      t: 'type',
      a: 'api',
      d: 'dependencies',
      D: 'devDependencies',
    },
    string: ['_'],
  })

  if (args.help) {
    // eslint-disable-next-line no-console
    console.log(helpMessage)
    return
  }

  if (args.pkg) {
    if (typeof args.pkg === 'boolean') {
      console.error('Miss pkg name')
      return
    }
    extract(args.pkg.split(','), {
      api: args.api,
      type: args.type,
    })
    return
  }

  if (args.dependencies) {
    extract(Object.keys(dependencies), {
      api: args.api,
      type: args.type,
    })
  }

  if (args.devDependencies) {
    extract(Object.keys(devDependencies), {
      api: args.api,
      type: args.type,
    })
  }
})()
