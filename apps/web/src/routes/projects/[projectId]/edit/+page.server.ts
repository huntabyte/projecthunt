import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';
import { updateProject } from '$lib/services/ProjectService';
import type { Technology, Topic, UpdateProjectActionData } from '$lib/types';
import { serializeNonPOJOs } from '$lib/utils';

export const load: PageServerLoad = ({ locals }) => {
	const getTechnologies = async () => {
		try {
			const technologies = serializeNonPOJOs(
				await locals.pb.collection('technologies').getFullList<Technology>(undefined)
			);
			return technologies;
		} catch (err) {
			const e = err as ClientResponseError;
			throw error(e.status, e.message);
		}
	};

	const getTopics = async () => {
		try {
			const topics = serializeNonPOJOs(
				await locals.pb.collection('topics').getFullList<Topic>(undefined)
			);
			return topics;
		} catch (err) {
			const e = err as ClientResponseError;
			throw error(e.status, e.message);
		}
	};

	return {
		technologies: getTechnologies(),
		topics: getTopics()
	};
};

export const actions: Actions = {
	update: async ({ request, locals, params }): Promise<UpdateProjectActionData> => {
		return await updateProject(locals, request, params.projectId, `/my/projects`);
	},
	delete: async ({ locals, params }): Promise<UpdateProjectActionData> => {
		try {
			await locals.pb.collection('projects').update(params.projectId, {
				thumbnail: null
			});
		} catch (err) {
			if (err instanceof ClientResponseError) {
				throw error(err.status, err.data.message);
			}
			throw error(500, 'Something went wrong');
		}
		return {
			success: true
		};
	}
};
