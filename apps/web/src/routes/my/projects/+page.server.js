import { error } from '@sveltejs/kit';
import { serializeNonPOJOs } from '$lib/helpers';
import { DefaultProject } from '$lib/_server_utils';

export const load = ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw error(401, 'Unauthorized');
	}

	const getUserProjects = async () => {
		try {
			const projects = serializeNonPOJOs(
				await locals.pb.collection('projects').getFullList(undefined, {
					filter: `user = "${locals.user.id}"`
				})
			);
			projects.map((project) => {
				return { ...DefaultProject, ...project };
			});
			return projects;
		} catch (err) {
			console.log('Error:', err);
			throw error(err.status, err.message);
		}
	};

	return {
		projects: getUserProjects()
	};
};
