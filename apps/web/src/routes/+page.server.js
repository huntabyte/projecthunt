import { serializeNonPOJOs } from '$lib/helpers';
import { DefaultProject } from '$lib/_server_utils';
import { error } from '@sveltejs/kit';

export const load = ({ locals }) => {
	const getProjects = async () => {
		let projects = serializeNonPOJOs(
			await locals.pb.collection('projects').getList(1, 15, {
				sort: '-created',
				expand: 'votes(project)'
			})
		);
		projects.items = projects.items.map((project) => {
			if (project.expand?.['votes(project)']) {
				project = { ...DefaultProject, ...project };
				return project;
			}
			project.expand['votes(project)'] = [];
			project = { ...DefaultProject, ...project };
			return project;
		});
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
