import type { User } from '$lib/types';
import { serializeNonPOJOs } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, params }) => {
	const getUserProfile = async (username: string) => {
		try {
			const user = serializeNonPOJOs<User>(
				await locals.pb.collection('users').getFirstListItem(`username = "${username}"`)
			);
			return user;
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;

			throw error(e.status, e.message);
		}
	};

	return {
		profile: getUserProfile(params.username)
	};
};
