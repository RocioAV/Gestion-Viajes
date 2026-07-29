import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/app.ts'],
  format: 'esm',
  clean: true,
  external: ['dotenv'],
})
