/** @type {import('tailwindcss').Config} */
const path = require('path')
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    path.join(require.resolve('@modou/canvas-designer'), '../**/*.{js,ts,jsx,tsx}'),

  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
  corePlugins: {
    preflight: false
  },
}
