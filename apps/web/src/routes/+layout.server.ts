import type { User } from '$lib/types';
import type { Admin } from 'pocketbase';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	if (locals.user) {
		return {
			user: locals.user
		};
	}

	return {
		user: undefined
	};
};
