import { error } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

export const getProjects = async (locals, page = 1, perPage = 100) => {
	try {
		let projects = serializeNonPOJOs(
			await locals.pb.collection('projects').getList(page, perPage, {
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
	} catch (err) {
		console.log('Error:', err);
		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		}
		throw error(500, 'Something went wrong with fetching the projects.');
	}
};
