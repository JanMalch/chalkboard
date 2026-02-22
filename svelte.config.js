import adapter from '@sveltejs/adapter-static';
import pkg from './package.json' with { type: 'json' };

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		paths: {
			base: process.env.CI === 'true' ? '/chalkboard' : ''
		},
		version: {
			name: pkg.version
		}
	}
};

export default config;
