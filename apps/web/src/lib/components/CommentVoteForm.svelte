<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Comment, CommentVote } from '$lib/types';
	import { CommentVoteButton } from '$lib/components';

	export let comment: Comment;

	let hasVoted = Boolean(
		comment.expand?.['comment_votes(comment)'].find(
			(vote: CommentVote) => vote.user === $page?.data?.user?.id
		)
	);
</script>

<form
	action="?/voteComment"
	method="POST"
	use:enhance={({ form }) => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				form.reset();
				hasVoted = !hasVoted;
			}
			if (result.type === 'invalid') {
				await applyAction(result);
			}
			update();
		};
	}}
>
	<input type="hidden" name="id" value={comment.id} />
	<CommentVoteButton {hasVoted} {comment} />
</form>
