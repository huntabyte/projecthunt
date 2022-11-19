import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	build: {
		target: 'esnext'
	},
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	optimizeDeps: {
		include: ['classnames']
	},
	ssr: {
		noExternal: ['zod-form-data']
	}
};

export default config;
