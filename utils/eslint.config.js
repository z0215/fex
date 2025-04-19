import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    lessOpinionated: true,
    typescript: true,
  },
  {
    rules: {
      'no-labels': 'off',
    },
  },
)
