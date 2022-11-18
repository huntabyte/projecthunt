const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		fontFamily: {
			sans: ['Roboto', 'system-ui', 'sans-serif'],
			heading: ['Roboto Condensed', 'Roboto', 'sans-serif']
		},
		extend: {
			height: {
				104: '26rem',
				112: '28rem',
				128: '32rem'
			}
		}
	},

	plugins: [
		require('daisyui'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/forms'),
		require('flowbite/plugin')
	]
};

module.exports = config;
