import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import basicSsl from '@vitejs/plugin-basic-ssl'
import * as path from 'path'
import * as fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // basicSsl()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    devSourcemap: true
  },
  server: {
    https: {
      cert: fs.readFileSync(path.join(__dirname, '../../keys/cert.crt')),
      key: fs.readFileSync(path.join(__dirname, '../../keys/cert.key'))
    }
  }
})
