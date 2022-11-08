const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require('daisyui'), require('@tailwindcss/aspect-ratio')]
};

module.exports = config;
