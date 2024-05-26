// @ts-check
import eslint from '@eslint/js'
import tsESLint from 'typescript-eslint'

export default tsESLint.config(
  eslint.configs.recommended,
  ...tsESLint.configs.recommended,
  ...tsESLint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
  },
)
