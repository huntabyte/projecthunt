import { error } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { Actions } from './$types';

export const actions: Actions = {
	publishProject: async ({ locals, params }) => {
		try {
			await locals.pb.collection('projects').update(params.projectId, { published: true });
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.data.data.images);
		}

		return {
			success: true
		};
	}
};
