import { defineConfig } from 'dumi'

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: '@modou/code-editor',
  },
  // 让所有 pages 下的 _mock.ts 文件成为 mock 文件
  mock: {
    include: ['src/**/_mock.ts'],
  },
  mfsu: false,
  // mfsu: {
  //   // exclude: ['vant'],
  // },
  // TODO 支持 css in js sourceMap
  // extraBabelPresets: [
  //   [
  //     '@emotion/babel-preset-css-prop',
  //     {
  //       autoLabel: 'dev-only',
  //       labelFormat: '[local]',
  //       // useBuiltIns: false,
  //       // throwIfNamespace: true,
  //     },
  //   ],
  // ],
})
