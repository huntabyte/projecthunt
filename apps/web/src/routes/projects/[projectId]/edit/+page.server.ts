import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ClientResponseError } from 'pocketbase';
import { updateProject } from '$lib/services/ProjectService';
import type { UpdateProjectActionData } from '$lib/types';

export const actions: Actions = {
	update: async ({ request, locals, params }): Promise<UpdateProjectActionData> => {
		return await updateProject(locals, request, params.projectId, `/my/projects`);
	},
	delete: async ({ locals, params }): Promise<UpdateProjectActionData> => {
		try {
			await locals.pb.collection('projects').update(params.projectId, {
				thumbnail: null
			});
		} catch (err) {
			if (err instanceof ClientResponseError) {
				throw error(err.status, err.data.message);
			}
			throw error(500, 'Something went wrong');
		}
		return {
			success: true
		};
	}
};
