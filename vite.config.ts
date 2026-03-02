import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import { FEDERATION_SHARED } from '@gaqno-development/frontcore/config/federation-shared'
import path from 'path'

export default defineConfig(async () => {
	const tailwindcss = (await import('@tailwindcss/vite')).default
	
	return {
	base: '/',
	server: {
		port: 3005,
		origin: 'http://localhost:3005',
		fs: {
			allow: ['.', '../shared'],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [
		react(),
		tailwindcss(),
		federation({
			name: 'finance',
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.tsx',
			},
			shared: FEDERATION_SHARED as any,
		}),
	],
	build: {
		modulePreload: false,
		target: 'esnext',
		minify: false,
		cssCodeSplit: false,
		commonjsOptions: {
			transformMixedEsModules: true,
			requireReturnsDefault: 'preferred',
		},
		rollupOptions: { output: { format: 'es' } },
	},
	optimizeDeps: { include: ['use-sync-external-store'] },
	}
})
