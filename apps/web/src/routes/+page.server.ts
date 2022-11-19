import { getProjects, updateProjectVote } from '$lib/services/ProjectService';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	return {
		projects: getProjects(locals, 'published = true')
	};
};

export const actions: Actions = {
	voteProject: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		return await updateProjectVote(locals, id as string);
	}
};
