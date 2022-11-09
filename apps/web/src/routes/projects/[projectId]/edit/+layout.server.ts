import { serializeNonPOJOs } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { Project } from '$lib/types';

export const load: LayoutServerLoad = ({ locals, params }) => {
	const getProject = async (projectId: string) => {
		const project = serializeNonPOJOs<Project>(
			await locals.pb.collection('projects').getOne(projectId)
		);
		if (locals?.user?.id != project.user) {
			throw error(401, 'You do not have permission to edit this project');
		} else {
			return project;
		}
	};
	return {
		project: getProject(params.projectId)
	};
};
