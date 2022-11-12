<script lang="ts">
	import { page } from '$app/stores';
	import type { Comment, CommentVote } from '$lib/types';

	export let comment: Comment;

	// let hasVoted = Boolean(
	// 	comment.expand?.['comment_votes(comment)'].find(
	// 		(vote: CommentVote) => vote.user === $page?.data?.user?.id
	// 	)
	// );
</script>

<form action="?/voteComment" method="POST">
	<input type="hidden" name="id" value={comment.id} />
	<button class="hover:cursor-pointer hover:underline opacity-80" type="submit">
		<span class="">Upvote</span>
	</button>
</form>
