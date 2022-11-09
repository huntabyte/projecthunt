const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			sans: ['Roboto', 'system-ui', 'sans-serif'],
			heading: ['Roboto Condensed', 'Roboto', 'sans-serif']
		},
		extend: {
			height: {
				128: '32rem'
			}
		}
	},

	plugins: [require('daisyui'), require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')]
};

module.exports = config;
