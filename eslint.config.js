import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{ts,tsx}'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,
    },
  },

  /*
   * RK BillPro context files intentionally export both:
   *
   * 1. React Provider components
   * 2. Custom context hooks such as useProducts(), useSales(), etc.
   *
   * This is a valid architecture for this project.
   * Disable only the Fast Refresh export restriction for context files.
   */
  {
    files: ['src/context/**/*.{ts,tsx}'],

    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])