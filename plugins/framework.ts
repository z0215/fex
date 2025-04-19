import type { Plugin } from 'vite'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'

const framework = (): Plugin => {
  return {
    name: 'vite-plugin-framework',
    handleHotUpdate({ file }) {
      const rootPath = cwd()
      const [targetFramework] = file.replace(rootPath, '').split('/').filter(Boolean)
      const frameworks = readdirSync(rootPath, 'utf-8')
        .filter(name => statSync(join(rootPath, name)).isDirectory())
        .filter(dir => existsSync(join(rootPath, dir, 'main.tsx')))

      if (!frameworks.includes(targetFramework)) {
        return
      }

      const htmlPath = join(rootPath, 'index.html')
      const htmlStr = readFileSync(htmlPath, 'utf-8').toString()

      // get current framework
      const currentFramework = htmlStr.match(/\/(.*)\/main/)?.at(1)
      if (!currentFramework || targetFramework === currentFramework) {
        return
      }

      // update path in index.html
      const newHtmlStr = htmlStr.replaceAll(currentFramework, targetFramework)
      writeFileSync(htmlPath, newHtmlStr, 'utf-8')

      // update path in vite.config.ts
      const configPath = join(rootPath, 'vite.config.ts')
      const configStr = readFileSync(configPath, 'utf-8').toString()
      const newConfigStr = configStr.replaceAll(currentFramework, targetFramework)
      writeFileSync(configPath, newConfigStr, 'utf-8')
    },
  }
}

export default framework
