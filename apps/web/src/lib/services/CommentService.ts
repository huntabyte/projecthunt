import { createCommentDto, createReplyDto, updateCommentDto } from '$lib/schemas';
import type { Comment, CommentActionData, ReplyActionData } from '$lib/types';
import { serializeNonPOJOs, validateData } from '$lib/utils';
import { error, invalid } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

export const getComments = async (locals: App.Locals, projectId: string) => {
	try {
		let commentReplies = serializeNonPOJOs<Comment[]>(
			await locals.pb.collection('comment_replies').getFullList<Comment>(undefined, {
				sort: '-created',
				filter: `comment.project = "${projectId}"`,
				expand: 'reply'
			})
		);

		const replyIdFilter = commentReplies
			.map((commentReply) => `id != "${commentReply.expand?.reply?.id}"`)
			.join(' || ');

		let comments = serializeNonPOJOs<Comment[]>(
			await locals.pb.collection('comments').getFullList<Comment>(undefined, {
				sort: '-created',
				filter: `project = "${projectId}" && (${replyIdFilter})`,
				expand: 'user, comment_replies(comment).reply.user'
			})
		);

		comments = comments.map((comment) => {
			if (comment.expand?.['comment_replies(comment)']) {
				return comment;
			}
			comment.expand['comment_replies(comment)'] = [];
			return comment;
		});
		console.log(comments);
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
	const { formData, errors } = await validateData(await request.formData(), createCommentDto);

	if (errors) {
		return invalid(400, {
			data: formData,
			errors: errors.fieldErrors
		});
	}
	let createdCommentId: string;

	try {
		if (formData.parentId) {
			const { id } = await locals.pb.collection('comments').create(formData);
			createdCommentId = id;
			await locals.pb
				.collection('comment_replies')
				.create({ comment: formData.parentId, reply: id });

			return {
				success: true
			};
		}

		throw error(400, 'A reply must have a parentId');
	} catch (err) {
		console.log('Error:', err);

		//TODO: Check ClientResponseError for failure to create reply, then delete comment before throwing
		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		}

		throw error(400, 'A reply must have a parent!');
	}
};
