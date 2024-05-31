// @ts-check
import globals from 'globals'

import tsESLint from 'typescript-eslint'

export default tsESLint.config(
  {
    ...tsESLint.configs['flat/recommended'],
    ...tsESLint.configs['flat/next'],

    plugins: {
      '@typescript-eslint': tsESLint.plugin,
    },

    files: [ 'src/**/*.js' ],

    rules: {

    },

    languageOptions: {
      sourceType: "module",
      parser: tsESLint.parser,
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      },
    },
  })
