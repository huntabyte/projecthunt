<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { Avatar } from '$lib/components';

	const submitCreateComment: SubmitFunction = ({ form }) => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				form.reset();
			}
			if (result.type === 'invalid') {
				await applyAction(result);
			}
			update();
		};
	};
</script>

<div class="flex items-start space-x-4 mt-6">
	<div class="flex-shrink-0">
		<Avatar classes="inline-block h-12 w-12 rounded-full" user={$page.data.user} />
	</div>
	<div class="min-w-0 flex-1">
		<form action="?/createComment" method="POST" class="relative" use:enhance={submitCreateComment}>
			<div
				class="overflow-hidden rounded-lg border border-base-300 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
			>
				<label for="content" class="sr-only">Add your comment</label>
				<textarea
					rows="3"
					name="content"
					id="content"
					class="block w-full resize-none border-0 py-3 focus:ring-0 "
					placeholder="What do you think?"
					value={$page.form?.data?.content ?? ''}
				/>

				<div class="py-2" aria-hidden="true">
					<div class="py-px">
						<div class="h-9" />
					</div>
				</div>
			</div>

			<div class="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2 ">
				<div class="flex-shrink-0">
					<button type="submit" class="btn btn-primary">Comment</button>
				</div>
			</div>
		</form>
		{#if $page.form?.errors?.content}
			{#each $page.form?.errors?.content as error}
				<label for="name" class="label py-0 mt-2">
					<div class="label-text-alt text-error">{error}</div>
				</label>
			{/each}
		{/if}
	</div>
</div>
