import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path-browserify';

const currentDir = new URL('.', import.meta.url).pathname;

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'use-sui-zklogin': path.resolve(currentDir, '../package/dist'),
		},
	},
	build: {
		outDir: 'dist',
		rollupOptions: {
			input: '/index.html',
		},
	},
	server: {
		open: true,
		port: 3000,
	},
	base: './',
});
