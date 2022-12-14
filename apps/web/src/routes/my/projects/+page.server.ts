import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUsersProjects } from '$lib/services/ProjectService';
import { deleteRecord } from '$lib/services/base';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw error(401, 'Unauthorized');
	}

	return {
		projects: getUsersProjects(locals)
	};
};

export const actions: Actions = {
	deleteProject: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());
		return await deleteRecord(locals, 'projects', id as string, '/my/projects');
	}
};
