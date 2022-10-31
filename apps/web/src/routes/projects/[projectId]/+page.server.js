import { serializeNonPOJOs } from '$lib/helpers';
import { DefaultProject } from '$lib/_server_utils';
import { formData, zfd } from 'zod-form-data';
import { z, ZodError } from 'zod';
import { ClientResponseError } from 'pocketbase';
import { error } from '@sveltejs/kit';

const commentSchema = zfd.formData({
	content: z.string().min(2).max(240).trim(),
	project: z.string()
});

export const load = ({ locals, params }) => {
	const getProject = async (projectId) => {
		const project = serializeNonPOJOs(await locals.pb.records.getOne('projects', projectId));
		const votes = serializeNonPOJOs(
			await locals.pb.records.getFullList('votes', 9999999, {
				filter: `project = "${project.id}"`
			})
		);
		project.votes = votes;

		return { DefaultProject, ...project };
	};

	const getComments = async (projectId) => {
		const comments = serializeNonPOJOs(
			await locals.pb.records.getFullList('comments', 9999999, {
				filter: `project = "${projectId}"`
			})
		);
		const usersIdFilter = comments.map((comment) => `userId = "${comment.user}"`).join(' || ');

		const usersList = serializeNonPOJOs(
			await locals.pb.records.getFullList('profiles', 99999, {
				filter: usersIdFilter
			})
		);

		comments.map((comment) => {
			comment.userProfile = usersList.find((user) => user.userId == comment.user);
			return comment;
		});

		return comments;
	};

	return {
		project: getProject(params.projectId),
		comments: getComments(params.projectId)
	};
};

export const actions = {
	vote: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		try {
			const existingVote = await locals.pb.records.getFullList('votes', 1, {
				filter: `user = "${locals.user.id}" && project = "${id}"`,
				sort: '-created'
			});
			if (existingVote.length < 1) {
				await locals.pb.records.create('votes', {
					user: locals.user.id,
					project: id
				});
			} else {
				const vote = serializeNonPOJOs(existingVote[0]);
				await locals.pb.records.delete('votes', vote.id);
			}
		} catch (err) {
			console.log('Error:', err);
			throw error(500, 'Something went wrong with voting.');
		}
	},
	createComment: async ({ request, locals }) => {
		let commentObj;
		try {
			commentObj = commentSchema.parse(await request.formData());
			commentObj.user = locals.user.id;
			await locals.pb.records.create('comments', commentObj);
		} catch (err) {
			console.log('Error:', err);
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return {
					data: commentObj,
					errors
				};
			}
			if (err instanceof ClientResponseError) {
				throw error(err.status, err.data.message);
			}
		}
		return {
			success: true
		};
	}
};
