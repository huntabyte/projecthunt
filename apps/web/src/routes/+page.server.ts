import { getProjects, vote } from '$lib/services/projects';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	return {
		projects: getProjects(locals)
	};
};

export const actions: Actions = {
	vote: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		return await vote(locals, id as string);
	}
};
