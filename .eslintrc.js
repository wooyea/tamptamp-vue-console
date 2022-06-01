module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'import/no-unresolved': 'error',
    eqeqeq: 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'dot-notation': ['error', { allowPattern: '^[a-z]+(_[a-z]+)+$' }],
    'max-len': ['error', { code: 300, ignoreUrls: true }],
    'no-console': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/multi-word-component-names': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'prefer-destructuring': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-param-reassign': ['error', { props: false }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-restricted-syntax': ['error'],
    radix: ['error', 'as-needed'],
    'max-classes-per-file': ['error', 2],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never',
      },
    ],
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: [],
    }],
    'vue/multiline-html-element-content-newline': ['error', {
      ignoreWhenEmpty: true,
      ignores: ['pre', 'textarea'],
      allowEmptyLines: false,
    }],
    'vue/no-multiple-template-root': 'off',
    'vue/component-tags-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 2,
      },
      multiline: {
        max: 1,
      },
    }],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'beside',
      multiline: 'below',
    }],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [
          'tsconfig.json',
        ],
      },
    },
  },
};
