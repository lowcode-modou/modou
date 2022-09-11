module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react'
  ],
  rules: {
    semi: ['error', 'never'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off'
  }
}
