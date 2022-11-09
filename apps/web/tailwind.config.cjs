const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			sans: ['Work Sans', 'system-ui', 'sans-serif'],
			serif: ['Merriweather', 'ui-serif', 'serif']
		},
		extend: {}
	},

	plugins: [require('daisyui'), require('@tailwindcss/aspect-ratio')]
};

module.exports = config;
