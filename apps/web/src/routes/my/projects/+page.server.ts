import { error, redirect } from '@sveltejs/kit';
import { serializeNonPOJOs } from '$lib/helpers';
import { DefaultProject } from '$lib/_server_utils';
import { ClientResponseError } from 'pocketbase';
import type { Actions, PageServerLoad } from './$types';
import type { Project } from '$lib/types';


export const load: PageServerLoad = ({ locals }) => {
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
			projects.map((project: Project) => {
				return { ...DefaultProject, ...project };
			});
			return projects;
		} catch (err) {
			if (err instanceof ClientResponseError) {
        throw error(err.status, err.message);
      }
      else {
        throw error(500, 'Something went wrong fetching projects')
      }
		}
	};

	return {
		projects: getUserProjects()
	};
};

export const actions: Actions = {
	deleteProject: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('projects').delete(id as string);
		} catch (err) {
			console.log('Error:', err);
			if (err instanceof ClientResponseError) {
				throw error(err.status, err.data.message);
			}
			throw error(500, 'Something went wrong');
		}
		throw redirect(303, '/my/projects');
	}
};
