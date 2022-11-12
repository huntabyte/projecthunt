import { createCommentDto, updateCommentDto } from '$lib/schemas';
import type { Comment, CommentActionData, CommentVote, ReplyActionData } from '$lib/types';
import { serializeNonPOJOs, validateData } from '$lib/utils';
import { error, invalid } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

export const getComments = async (locals: App.Locals, projectId: string) => {
	try {
		let commentReplies = serializeNonPOJOs<Comment[]>(
			await locals.pb.collection('comment_replies').getFullList<Comment>(undefined, {
				sort: '-created',
				filter: `comment.project = "${projectId}"`,
				expand: 'reply, reply.comment_votes(comment), reply.user'
			})
		);

		const replyIdFilter = commentReplies
			.map((commentReply) => `id != "${commentReply.expand?.reply?.id}"`)
			.join(' && ');

		let comments;

		if (replyIdFilter) {
			comments = serializeNonPOJOs<Comment[]>(
				await locals.pb.collection('comments').getFullList<Comment>(undefined, {
					sort: '-created',
					filter: `project = "${projectId}" && (${replyIdFilter})`,
					expand:
						'user, comment_replies(comment).reply.user, comment_votes(comment), comment_replies(comment).reply'
				})
			);

			comments.forEach((comment) => {
				comment.expand['comment_replies(comment)'] = comment.expand[
					'comment_replies(comment)'
				]?.map((commentReply) => {
					let updatedReply;
					commentReplies.forEach((reply) => {
						if (reply.id === commentReply.id) {
							if (reply.expand?.reply?.expand['comment_votes(comment)']) {
								updatedReply = reply;
							} else {
								reply.expand.reply.expand['comment_votes(comment)'] = [];
								updatedReply = reply;
							}
						}
					});
					return updatedReply;
				});
			});
			// console.log(comments[0].expand['comment_replies(comment)'][0].expand);
		} else {
			comments = serializeNonPOJOs<Comment[]>(
				await locals.pb.collection('comments').getFullList<Comment>(undefined, {
					sort: '-created',
					filter: `project = "${projectId}"`,
					expand: 'user, comment_replies(comment).reply.user, comment_votes(comment)'
				})
			);
		}

		comments = comments.map((comment) => {
			if (!comment.expand?.['comment_replies(comment)']) {
				comment.expand['comment_replies(comment)'] = [];
			}
			if (!comment.expand?.['comment_votes(comment)']) {
				comment.expand['comment_votes(comment)'] = [];
			}
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

export const deleteComment = async (locals: App.Locals, id: string) => {
	try {
		const comment = serializeNonPOJOs<Comment>(
			await locals.pb.collection('comments').getOne(id as string, {
				expand: 'comment_replies(comment).reply'
			})
		);

		if (comment.expand['comment_replies(comment)']) {
			if (comment.expand['comment_replies(comment)'].length > 0) {
				for (const commentReply of comment.expand['comment_replies(comment)']) {
					await locals.pb.collection('comments').delete(commentReply.expand.reply.id);
				}
			}
		}

		await locals.pb.collection('comments').delete(comment.id);
	} catch (err) {
		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		} else {
			throw error(500, 'Something went wrong while deleting your comment.');
		}
	}
};

export const updateCommentVote = async (locals: App.Locals, commentId: string) => {
	try {
		const existingVote = await locals.pb.collection('comment_votes').getFullList<CommentVote>(1, {
			filter: `user = "${locals?.user?.id}" && comment = "${commentId}"`,
			sort: '-created'
		});
		if (existingVote.length < 1) {
			await locals.pb.collection('comment_votes').create({
				user: locals?.user?.id,
				comment: commentId
			});
		} else {
			const vote = serializeNonPOJOs(existingVote[0]);
			await locals.pb.collection('comment_votes').delete(vote.id);
		}
	} catch (err) {
		console.log('Error:', err);
		throw error(500, 'Something went wrong with voting.');
	}
};
