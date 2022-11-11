<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { getImageURL } from '$lib/utils';
	import type { Comment } from '$lib/types';

	export let comment: Comment;
	export let showReply: boolean;
</script>

<div class="flex w-full items-center space-x-4 mt-4">
	<div class="avatar">
		<div class="w-12 rounded-full">
			<img
				src={$page.data.user?.avatar
					? getImageURL(
							$page.data.user?.collectionName,
							$page.data.user?.id,
							$page.data.user?.avatar
					  )
					: `https://ui-avatars.com/api/?name=${$page.data?.user?.name}`}
				alt="User Avatar"
			/>
		</div>
	</div>
	<form
		action="?/createReply"
		method="POST"
		class="flex w-full justify-between max-w-lg"
		use:enhance={({ form }) => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					form.reset();
					showReply = false;
				}
				if (result.type === 'invalid') {
					await applyAction(result);
				}
				update();
			};
		}}
	>
		<div class="w-full">
			<input type="hidden" name="user" value={$page.data?.user?.id} />
			<input type="hidden" name="comment" value={comment.id} />
			<input
				type="text"
				class="input input-bordered w-full mb-2"
				name="content"
				value={$page.form?.data?.content ?? `@${comment.expand.user.username}`}
			/>
			{#if $page.form?.errors?.content}
				{#each $page.form?.errors?.content as error}
					<label for="name" class="label py-0">
						<div class="label-text-alt text-error">{error}</div>
					</label>
				{/each}
			{/if}
		</div>
		<div class="ml-4">
			<button type="submit" class="btn btn-outline">Reply</button>
		</div>
	</form>
</div>
