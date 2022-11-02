import { serializeNonPOJOs } from '$lib/helpers';
import { error } from '@sveltejs/kit';
import { getProjects } from '$lib/api';
import type { PageServerLoad, Action, ActionData, Actions } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	return {
		projects: getProjects(locals)
	};
};

export const actions: Actions = {
	vote: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			const existingVote = await locals.pb.collection('votes').getFullList(1, {
				filter: `user = "${locals.user.id}" && project = "${id}"`,
				sort: '-created'
			});
			if (existingVote.length < 1) {
				const newVote = await locals.pb.collection('votes').create({
					user: locals.user.id,
					project: id
				});
			} else {
				const vote = serializeNonPOJOs(existingVote[0]);
				await locals.pb.collection('votes').delete(vote.id);
			}
		} catch (err) {
			console.log('Error:', err);
			throw error(500, 'Something went wrong with voting.');
		}
	}
};
