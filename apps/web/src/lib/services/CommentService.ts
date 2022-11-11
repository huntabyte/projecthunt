import { createCommentDto, createReplyDto, updateCommentDto, updateReplyDto } from '$lib/schemas';
import type { Comment, CommentActionData, ReplyActionData } from '$lib/types';
import { serializeNonPOJOs, validateData } from '$lib/utils';
import { error, invalid } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';

export const getComments = async (locals: App.Locals, projectId: string) => {
	try {
		let comments = serializeNonPOJOs<Comment[]>(
			await locals.pb.collection('comments').getFullList<Comment>(undefined, {
				filter: `project = "${projectId}"`,
				expand: 'user, comment_replies(comment).user'
			})
		);
		comments = comments.map((comment) => {
			if (comment.expand?.['comment_replies(comment)']) {
				return comment;
			}
			comment.expand['comment_replies(comment)'] = [];
			return comment;
		});
		return comments;
	} catch (err) {
		console.log('Error: ', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}
};

export const createComment = async (
	locals: App.Locals,
	request: Request
): Promise<CommentActionData> => {
	const { formData, errors } = await validateData(await request.formData(), createCommentDto);

	if (errors) {
		return invalid(400, {
			data: formData,
			errors: errors.fieldErrors
		});
	}

	try {
		await locals.pb.collection('comments').create(formData);
		return {
			success: true
		};
	} catch (err) {
		console.log('Error:', err);

		const e = err as ClientResponseError;

		throw error(e.status, e.data.message);
	}
};

export const updateComment = async (
	locals: App.Locals,
	request: Request
): Promise<CommentActionData> => {
	const { formData, errors } = await validateData(await request.formData(), updateCommentDto);

	if (errors) {
		return invalid(400, {
			updateData: formData,
			updateErrors: errors.fieldErrors
		});
	}

	try {
		await locals.pb.collection('comments').update(formData.id, formData);
		return {
			success: true
		};
	} catch (err) {
		console.log('Error:', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}
};

export const createReply = async (
	locals: App.Locals,
	request: Request
): Promise<ReplyActionData> => {
	const { formData, errors } = await validateData(await request.formData(), createReplyDto);

	if (errors) {
		return invalid(400, {
			data: formData,
			errors: errors.fieldErrors
		});
	}

	try {
		await locals.pb.collection('comment_replies').create(formData);
		return {
			success: true
		};
	} catch (err) {
		console.log('Error:', err);

		const e = err as ClientResponseError;

		throw error(e.status, e.data.message);
	}
};

export const updateReply = async (
	locals: App.Locals,
	request: Request
): Promise<ReplyActionData> => {
	const { formData, errors } = await validateData(await request.formData(), updateReplyDto);

	if (errors) {
		return invalid(400, {
			updateData: formData,
			updateErrors: errors.fieldErrors
		});
	}

	try {
		await locals.pb.collection('comment_replies').update(formData.id, formData);
		return {
			success: true
		};
	} catch (err) {
		console.log('Error:', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}
};
