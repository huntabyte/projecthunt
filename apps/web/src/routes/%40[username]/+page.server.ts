import type { Actions, PageServerLoad } from './$types';
import { getProjects, updateProjectVote } from '$lib/services/ProjectService';

export const load: PageServerLoad = ({ locals, params }) => {
	return {
		projects: getProjects(locals, `user.username = "${params.username}" && published = true`)
	};
};

export const actions: Actions = {
	voteProject: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		return await updateProjectVote(locals, id as string);
	}
};
