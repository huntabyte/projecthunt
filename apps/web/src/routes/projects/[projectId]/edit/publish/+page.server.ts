import { error, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { project } = await parent();

	if (project.published) {
		throw redirect(303, `/projects/${project.id}/edit`);
	}
};

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
