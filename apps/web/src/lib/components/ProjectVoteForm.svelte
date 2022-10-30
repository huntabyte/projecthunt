<script>
	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import FaCaretUp from 'svelte-icons/fa/FaCaretUp.svelte';
	export let project;
	let hasVoted = Boolean(project.votes.find((vote) => vote.user === $page?.data?.profile?.userId));
</script>

<form
	action="?/vote"
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
	<input type="hidden" value={project.id} name="id" />
	{#if $page?.data?.profile}
		<button
			type="submit"
			class="btn btn-outline flex flex-col space-y-1 items-center justify-center p-3 h-auto z-10 {hasVoted
				? 'btn-primary'
				: 'border-base-300'}"
		>
			<div class="h-6 w-6">
				<FaCaretUp />
			</div>
			<div class="text-xs">{project?.votes?.length ?? ''}</div>
		</button>
	{:else}
		<a
			href="/login"
			class="btn btn-outline flex flex-col space-y-1 items-center justify-center p-3 h-auto z-10"
		>
			<div class="h-6 w-6">
				<FaCaretUp />
			</div>
			<div class="text-xs">{project?.votes?.length ?? ''}</div>
		</a>
	{/if}
</form>
