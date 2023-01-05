import { defineConfig } from 'father'

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: 'dist/esm' },
  // TODO 优化引入的第三方依赖 比如lodash
  umd: { name: 'ModouCodeEditor', output: 'dist/umd' },
})
