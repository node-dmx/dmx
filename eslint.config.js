import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ...js.configs.recommended,

    languageOptions: {
      globals: {
        ...globals.node
      },

      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: [ 'src/**/*.js' ],
  },

  {
    files: [ 'test/**/*.js' ],

    languageOptions: {
      globals: {
        ...globals.jest
      },
    },
  },
]
