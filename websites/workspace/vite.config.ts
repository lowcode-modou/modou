import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import { resolve } from 'path'
// import { visualizer } from "rollup-plugin-visualizer";
// import basicSsl from '@vitejs/plugin-basic-ssl'
import * as path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          [
            '@emotion/babel-preset-css-prop',
            {
              autoLabel: 'dev-only',
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
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        simulatorPC: resolve(__dirname, 'simulator/pc.html'),
      },
    },
  },
})
