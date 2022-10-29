import { serializeNonPOJOs } from '$lib/helpers';
import { error } from '@sveltejs/kit';

export const load = ({ locals }) => {
	const getProjects = async () => {
		const projects = serializeNonPOJOs(
			await locals.pb.records.getList('projects', 1, 15, {
				sort: '-created'
			})
		);

		const projectsIdFilter = projects.items
			.map((project) => `project = "${project.id}"`)
			.join(' || ');
		const voteList = serializeNonPOJOs(
			await locals.pb.records.getFullList('votes', 99999, {
				filter: projectsIdFilter
			})
		);
		console.log(voteList);

		return projects;
	};

	return {
		projects: getProjects()
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
