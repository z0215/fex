import prompts from 'prompts'
import colors from 'picocolors'
import { getHandles } from './_utils'

try {
  const handleList = await getHandles()

  const response = await prompts(
    [
      {
        type: 'select',
        name: 'handle',
        message: 'Operation',
        choices: handleList.map(item => ({
          title: item.name,
          value: item.name,
          description: item.m.default.desc,
        })),
      },
      {
        type: (prev, values) => (['add', 'remove'].includes(values.handle) ? 'text' : null),
        name: 'language',
        message: 'Language',
        validate: value => value.length || 'Required',
      },
      {
        type: (prev, values) => (values.handle === 'remove' ? 'confirm' : null),
        name: 'confirm',
        message: 'Can you confirm?',
      },
    ],
    {
      onCancel: () => {
        throw new Error(`${colors.red('✖')} Operation cancelled`)
      },
    },
  )

  const currentHandle = handleList.find(item => item.name === response.handle)
  currentHandle?.m.default.handle(response)
}
catch (error) {
  console.log((error as ErrorEvent).message)
}

