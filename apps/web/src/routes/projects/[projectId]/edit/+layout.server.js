import { DefaultProject } from '$lib/_server_utils';
import { serializeNonPOJOs } from '$lib/helpers';

export const load = ({ locals, params }) => {
	const getProject = async (projectId) => {
		const project = serializeNonPOJOs(await locals.pb.records.getOne('projects', projectId));
		if (locals.user.id != project.user) {
			throw error(401, 'You do not have permission to edit this project');
		} else {
			return project;
		}
	};
	return {
		project: getProject(params.projectId)
	};
};
