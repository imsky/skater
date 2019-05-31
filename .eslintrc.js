module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'eqeqeq': ['error', 'always'],
    'no-implicit-coercion': 'error',
    'no-useless-return': 'error',
    'radix': 'error'
  }
}
