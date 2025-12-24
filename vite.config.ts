import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
	base: '/',
	server: {
		port: 3005,
		origin: 'http://localhost:3005',
		fs: {
			allow: ['.', '../shared'],
		},
	},
	plugins: [
		react(),
		federation({
			name: 'finance',
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/App.tsx',
			},
			shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
		}),
	],
	build: {
		modulePreload: false,
		target: 'esnext',
		minify: false,
		cssCodeSplit: false,
	},
})
