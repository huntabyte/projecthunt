import { serializeNonPOJOs } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { Project } from '$lib/types';

export const load: LayoutServerLoad = ({ locals, params }) => {
	const getProject = async (projectId: string) => {
		const project = serializeNonPOJOs<Project>(
			await locals.pb.collection('projects').getOne(projectId, {
				expand:
					'project_votes(project), projects_technologies(project).technology, projects_topics(project).topic'
			})
		);

		if (!project.expand?.['project_votes(project)']) {
			project.expand['project_votes(project)'] = [];
		}

		if (!project.expand?.['projects_technologies(project)']) {
			project.expand['projects_technologies(project)'] = [];
		}

		if (!project.expand?.['projects_topics(project)']) {
			project.expand['projects_topics(project)'] = [];
		}

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
