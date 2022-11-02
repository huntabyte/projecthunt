import { serializeNonPOJOs } from '$lib/helpers';
import { DefaultProject } from '$lib/_server_utils';
import { zfd } from 'zod-form-data';
import { z, ZodError } from 'zod';
import { ClientResponseError } from 'pocketbase';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Comment } from '$lib/types';
import { createCommentDto, updateCommentDto } from '$lib/schemas';



export const load: PageServerLoad = ({ locals, params, url }) => {
	const getProject = async (projectId: string) => {
		const project = serializeNonPOJOs(
			await locals.pb.collection('projects').getOne(projectId, {
				expand: 'votes(project)'
			})
		);
		if (project.expand?.['votes(project)']) {
			return { ...DefaultProject, ...project };
		}
		project.expand['votes(project)'] = [];

		return { ...DefaultProject, ...project };
	};

	const getComments = async (projectId: string) => {
		const comments = serializeNonPOJOs(
			await locals.pb.collection('comments').getFullList(undefined, {
				filter: `project = "${projectId}"`,
				expand: 'user'
			})
		);

		return comments;
	};

	return {
		project: getProject(params.projectId),
		comments: getComments(params.projectId),
		showEdit: url.searchParams.get('showEdit'),
		editId: url.searchParams.get('editId')
	};
};

export const actions: Actions = {
	vote: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			const existingVote = await locals.pb.collection('votes').getFullList(99999999, {
				filter: `user = "${locals.user.id}" && project = "${id}"`,
				sort: '-created'
			});

			if (existingVote.length < 1) {
				await locals.pb.collection('votes').create({
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
	},
	createComment: async ({ request, locals, params }) => {
		let commentObj = {
			user: locals.user.id,
			project: params.projectId
		};
		try {
			commentObj = { ...createCommentDto.parse(await request.formData()), ...commentObj };
			await locals.pb.collection('comments').create(commentObj);
		} catch (err) {
			console.log('Error:', err);
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return invalid(400, {
					data: commentObj,
					errors
				});
			}
			if (err instanceof ClientResponseError) {
				throw error(err.status, err.data.message);
			}
		}
		return {
			success: true
		};
	},
	updateComment: async ({ request, locals, params }) => {
		let commentObj: Partial<Comment> = {
			user: locals.user.id,
			project: params.projectId
		};

		try {
			commentObj = { ...updateCommentDto.parse(await request.formData()), ...commentObj };

      if (!commentObj.id) {
        return invalid(400, {
          data: commentObj,
        })
      }

			await locals.pb.collection('comments').update(commentObj.id , commentObj);
		} catch (err) {
			console.log('Error:', err);
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return invalid(400, {
					data: commentObj,
					errors
				});
			}
			if (err instanceof ClientResponseError) {
				throw error(err.status, err.data.message);
			}
		}
		return {
			success: true
		};
	},
	deleteComment: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData())
		try {
			await locals.pb.collection('comments').delete(id as string);
			return {
				success: true
			};
		} catch (err) {
			console.log('Error:', err);
			if (err instanceof ClientResponseError) {
				throw error(err.status, err.data.message);
			}
		}
	},
	showEdit: async ({ request, params }) => {
		const { editId } = Object.fromEntries(await request.formData());
		throw redirect(303, `/projects/${params.projectId}?showEdit=true&editId=${editId}#${editId}`);
	}
};
