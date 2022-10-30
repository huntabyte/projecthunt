import { serializeNonPOJOs } from '$lib/helpers';
import { DefaultProject } from '$lib/_server_utils';

export const load = ({ locals, params }) => {
	const getProject = async (projectId) => {
		const project = serializeNonPOJOs(await locals.pb.records.getOne('projects', projectId));
		const votes = serializeNonPOJOs(
			await locals.pb.records.getFullList('votes', 9999999, {
				filter: `project = "${project.id}"`
			})
		);
		project.votes = votes;

		return { DefaultProject, ...project };
	};

	return {
		project: getProject(params.projectId)
	};
};

export const actions = {
	vote: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			const existingVote = await locals.pb.records.getFullList('votes', 1, {
				filter: `user = "${locals.user.id}" && project = "${id}"`,
				sort: '-created'
			});
			if (existingVote.length < 1) {
				const newVote = await locals.pb.records.create('votes', {
					user: locals.user.id,
					project: id
				});
			} else {
				const vote = serializeNonPOJOs(existingVote[0]);
				await locals.pb.records.delete('votes', vote.id);
			}
		} catch (err) {
			console.log('Error:', err);
			throw error(500, 'Something went wrong with voting.');
		}
	}
};
