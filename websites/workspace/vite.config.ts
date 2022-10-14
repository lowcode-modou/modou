import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { visualizer } from "rollup-plugin-visualizer";
// import basicSsl from '@vitejs/plugin-basic-ssl'
import * as path from 'path'
import * as fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          [
            '@emotion/babel-preset-css-prop',
            {
              autoLabel: 'always',
              labelFormat: '[local]',
              importMap: {
                '@modou/css-in-js': {
                  mcss: {
                    canonicalImport: ['@emotion/css', 'css'],
                  },
                  injectGlobal: {
                    canonicalImport: ['@emotion/css', 'injectGlobal'],
                  },
                  keyframes: {
                    canonicalImport: ['@emotion/css', 'keyframes'],
                  },
                  // useTheme: {
                  //   canonicalImport: ['@emotion/react', 'useTheme'],
                  // },
                  // ThemeProvider: {
                  //   canonicalImport: ['@emotion/react', 'ThemeProvider'],
                  // },
                },
              },
              // useBuiltIns: false,
              // throwIfNamespace: true,
            },
          ],
        ],
      },
    }),
    // basicSsl()
    // visualizer()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    devSourcemap: true,
  },
  server: {
    https: {
      cert: fs.readFileSync(path.join(__dirname, '../../keys/cert.crt')),
      key: fs.readFileSync(path.join(__dirname, '../../keys/cert.key')),
    },
  },
})
