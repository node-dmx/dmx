import js from '@eslint/js'
import tsLintPlugin from '@typescript-eslint/eslint-plugin'
import tsLintParser from '@typescript-eslint/parser'
import globals from 'globals'

const baseConfig = {
  ...js.configs.recommended,
  ...tsLintPlugin.configs.recommendedTypeCheckedOnly,
  ...tsLintPlugin.configs.stylecticTypeCheckedOnly,
}

const srcConfig = {
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
    '@typescript-eslint/no-explicit-any': [ 'warn', { fixToUnknown: true } ],
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 'off',
  },
}

const testConfig = {
  files: [ 'test/**/*' ],
  languageOptions: {
    globals: globals.jest,
  },
}

const nodeConfig = {
  languageOptions: {
    globals: globals.node,
  },
}

export default [ baseConfig, srcConfig, testConfig, nodeConfig ]
