import type { PageServerLoad } from './$types';
import type { ClientResponseError } from 'pocketbase';
import { error } from '@sveltejs/kit';
import { serializeNonPOJOs } from '$lib/utils';
import type { ProjectVote } from '$lib/types';

export const load: PageServerLoad = ({ locals, params }) => {
	const getUpvotedProjects = async (username: string) => {
		try {
			const votes = serializeNonPOJOs<ProjectVote[]>(
				await locals.pb.collection('project_votes').getFullList(undefined, {
					expand: 'project.project_votes(project), project.comments(project)',
					filter: `user.username = "${username}"`
				})
			);

			const projects = votes.map((vote) => {
				return vote.expand.project;
			});

			return projects;
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.message);
		}
	};

	return {
		projects: getUpvotedProjects(params.username)
	};
};
