import antfu from '@antfu/eslint-config'

export default antfu({
  node: true,
  typescript: true,

  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
    braceStyle: 'stroustrup', // '1tbs', or 'allman'
  },

  jsonc: false,
  yaml: false,
})
