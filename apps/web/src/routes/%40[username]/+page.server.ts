import type { Project, User } from '$lib/types';
import { serializeNonPOJOs } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';
import type { ClientResponseError } from 'pocketbase';
import { error } from '@sveltejs/kit';
import { getProjects, updateProjectVote } from '$lib/services/ProjectService';

export const load: PageServerLoad = ({ locals, params }) => {
	return {
		projects: getProjects(locals, `user.username = "${params.username}"`)
	};
};

export const actions: Actions = {
	voteProject: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		return await updateProjectVote(locals, id as string);
	}
};
