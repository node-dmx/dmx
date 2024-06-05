import esLint from '@eslint/js'
import globals from 'globals'
import tsLint from 'typescript-eslint'

export default tsLint.config({
  ...esLint.configs.recommended,

  extends: tsLint.configs['flat/recommended'],

  files: [ 'src/**/*.js' ],

  languageOptions: {
    parser: tsLint.parser,
    globals: {
      ...globals.node,
    },

    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
