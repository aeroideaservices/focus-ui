module.exports = {
  env: {
    browser: true,
    es6: true,
    es2017: true,
    node: true,
  },
  extends: ['airbnb-typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'simple-import-sort',
    'react-hooks',
    'unused-imports',
  ],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    'react/jsx-filename-extension': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'import/prefer-default-export': 0,
    'react/prop-types': 0,
    'jsx-a11y/anchor-is-valid': 0,
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/order': 0,
    'import/extensions': 0,
    'react-hooks/rules-of-hooks': 'error',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // common types
          ['^@/types'],
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          // api
          ['^@?\\/api'],
          // api
          ['^@?\\/utils'],
          // misc
          ['^@?\\/[^(ui|api|utils)]'],
          // UI
          ['^@?\\/ui\\/[^ce]', '^@?\\/ui\\/e', '^@?\\/ui\\/c'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports-ts': 1,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
        'no-console': 'off',
        'no-restricted-syntax': [
          'warn',
          {
            selector:
              'CallExpression[callee.object.name="console"][callee.property.name=/^(log|warn|info|trace)$/]',
            message: 'Unexpected property on console object was called',
          },
        ],
      },
    },
  ],
  ignorePatterns: ['*.js', 'mock/**/*'],
  globals: {
    caches: false,
    fetch: false,
  },
};
