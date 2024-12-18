import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'use-sui-zklogin': '../../package/dist',
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
