import { serializeNonPOJOs } from '$lib/helpers';

export const load = ({ locals }) => {
	if (locals.user) {
		return {
			user: locals.user
		};
	}

	return {
		user: undefined
	};
};
