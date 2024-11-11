import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import { resolve } from 'path'
// import basicSsl from '@vitejs/plugin-basic-ssl'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import mkcert from "vite-plugin-mkcert";
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mkcert(),
    nodePolyfills(),
    react({
      babel: {
        plugins: [
          [
            '@emotion',
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
    visualizer({
      gzipSize: true,
      title: '墨斗-打包分析',
    }),
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
    https:{},
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        simulatorPC: resolve(__dirname, 'simulator/pc/index.html'),
      },
    },
  },
})
