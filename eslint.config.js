import js from '@eslint/js'
import tsLintPlugin from '@typescript-eslint/eslint-plugin'
import tsLintParser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
  js.configs.recommended,

  {
    ...tsLintPlugin.configs.recommendedTypeCheckedOnly,
    ...tsLintPlugin.configs.stylecticTypeCheckedOnly,
    languageOptions:
      {
        globals: {
          ...globals.node,
        },
      },
  },

  {
    files: [ 'src/**/*' ],
    languageOptions: {
      parser: tsLintParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsLintPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': [ 'warn', { 'fixToUnknown': true } ],
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'off',
    },
  },

  {
    files: [ 'test/**/*' ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]
