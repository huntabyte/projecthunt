<script lang="ts">
	import { page } from '$app/stores';
	import type { Comment } from '$lib/types';
	export let comment: Comment;
	export let hasVoted: boolean;
</script>

{#if $page.data?.user}
	<button class="hover:cursor-pointer hover:underline opacity-80" type="submit">
		<span class:text-primary={hasVoted}
			>{hasVoted ? 'Upvoted' : 'Upvote'}
			{comment.expand['comment_votes(comment)'].length > 0
				? `(${comment.expand['comment_votes(comment)'].length})`
				: ''}
		</span>
	</button>
{:else}
	<a href="/login" class="hover:cursor-pointer hover:underline opacity-80" type="submit">
		<span
			>Upvote
			{comment.expand['comment_votes(comment)'].length > 0
				? `(${comment.expand['comment_votes(comment)'].length})`
				: ''}
		</span>
	</a>
{/if}
