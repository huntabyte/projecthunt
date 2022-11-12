import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getProject, updateProjectVote } from '$lib/services/ProjectService';
import {
	createComment,
	createReply,
	deleteComment,
	getComments,
	updateComment,
	updateCommentVote
} from '$lib/services/CommentService';
import { deleteRecord } from '$lib/services/base';

export const load: PageServerLoad = ({ locals, params, url }) => {
	return {
		project: getProject(locals, params.projectId),
		comments: getComments(locals, params.projectId),
		showEdit: url.searchParams.get('showEdit'),
		editId: url.searchParams.get('editId')
	};
};

export const actions: Actions = {
	voteProject: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		return await updateProjectVote(locals, id as string);
	},
	createComment: async ({ request, locals }) => {
		return await createComment(locals, request);
	},
	updateComment: async ({ request, locals }) => {
		return await updateComment(locals, request);
	},
	deleteComment: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());
		return await deleteComment(locals, id as string);
	},
	showEdit: async ({ request, params }) => {
		const { editId } = Object.fromEntries(await request.formData());
		throw redirect(303, `/projects/${params.projectId}?showEdit=true&editId=${editId}#${editId}`);
	},
	createReply: async ({ request, locals }) => {
		return await createReply(locals, request);
	},

	deleteReply: async ({ request, locals, params }) => {
		const { id } = Object.fromEntries(await request.formData());
		return await deleteRecord(
			locals,
			'comment_replies',
			id as string,
			`/projects/${params.projectId}`
		);
	},
	voteComment: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		return await updateCommentVote(locals, id as string);
	}
};
