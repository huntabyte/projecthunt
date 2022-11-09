import type { Actions } from './$types';

export const actions: Actions = {
	updateEmail: async ({ request, locals }) => {
		console.log('update email');
	}
};
