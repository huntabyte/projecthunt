import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getProject, vote } from '$lib/services/projects';
import { createComment, getComments, updateComment } from '$lib/services/comments';
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
	vote: async ({ request, locals }) => {
		const { id } = Object.fromEntries(await request.formData());

		return await vote(locals, id as string);
	},
	createComment: async ({ request, locals }) => {
		return await createComment(locals, request);
	},
	updateComment: async ({ request, locals }) => {
		return await updateComment(locals, request);
	},
	deleteComment: async ({ request, locals, params }) => {
		const { id } = Object.fromEntries(await request.formData());
		return await deleteRecord(locals, 'comments', id as string, `/projects/${params.projectId}`);
	},
	showEdit: async ({ request, params }) => {
		const { editId } = Object.fromEntries(await request.formData());
		throw redirect(303, `/projects/${params.projectId}?showEdit=true&editId=${editId}#${editId}`);
	}
};
// createReply: async ({ request, locals }) => {
// 	return await createReply(locals, request);
// }
