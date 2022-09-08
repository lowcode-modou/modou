const config = require('@modou/config/index.cjs')
module.exports = {
  ...config.eslint,
  parserOptions: {
    project: [__dirname + '/tsconfig.json']
  }
}
