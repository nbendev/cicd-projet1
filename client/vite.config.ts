import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig(({ mode }) => {
  // charge .env et expose à process.env
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  const isCoverage = process.env.VITE_COVERAGE === 'true' || process.env.CYPRESS_COVERAGE === 'true'

  return {
    plugins: [
      vue(),
      // instrumente uniquement quand demandé
      isCoverage &&
        istanbul({
          include: 'src/**/*',
          exclude: ['node_modules', 'dist', 'build', 'test', 'tests', 'cypress'],
          extension: ['.js', '.ts', '.vue'],
          forceBuildInstrument: true, // force en mode build
          requireEnv: false,          // la variable est gérée par isCoverage ci-dessus
        }),
    ].filter(Boolean),
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { proxy: { '/api': 'http://localhost:3000' } },
    build: { sourcemap: true },
  }
})
