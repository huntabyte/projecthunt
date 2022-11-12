<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import type { Project, ProjectVote } from '$lib/types';
	import FaCaretUp from 'svelte-icons/fa/FaCaretUp.svelte';
	import FaRegHeart from 'svelte-icons/fa/FaRegHeart.svelte';
	import FaHeart from 'svelte-icons/fa/FaHeart.svelte';
	export let project: Project;
	let hasVoted = Boolean(
		project.expand?.['project_votes(project)'].find(
			(vote: ProjectVote) => vote.user === $page?.data?.user?.id
		)
	);
	export let variant = 'default';
</script>

<form
	action="?/voteProject"
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

	{#if variant === 'default'}
		{#if $page?.data?.user}
			<button
				type="submit"
				class="btn btn-outline flex flex-col space-y-1 items-center justify-center p-3 h-auto z-10 {hasVoted
					? 'btn-primary'
					: 'border-base-300'}"
			>
				<div class="h-6 w-6">
					<FaCaretUp />
				</div>
				<div class="text-xs">{project?.expand?.['project_votes(project)'].length ?? ''}</div>
			</button>
		{:else}
			<a
				href="/login"
				class="btn btn-outline flex flex-col space-y-1 items-center justify-center p-3 h-auto z-10"
			>
				<div class="h-6 w-6">
					<FaCaretUp />
				</div>
				<div class="text-xs">{project?.expand?.['project_votes(project)'].length ?? ''}</div>
			</a>
		{/if}
	{:else if variant === 'heart'}
		{#if $page?.data?.user}
			<button
				type="submit"
				class="flex space-x-2 items-center justify-center {hasVoted ? 'text-primary' : 'text-base'}"
			>
				<div class="w-5 h-5">
					{#if hasVoted}
						<FaHeart />
					{:else}
						<FaRegHeart />
					{/if}
				</div>
				<div class="font-medium text-sm">
					{project?.expand?.['project_votes(project)'].length ?? ''}
				</div>
			</button>
		{:else}
			<a href="/login" class=" flex space-x-2 items-center justify-center ">
				<div class="w-5 h-5">
					{#if hasVoted}
						<FaHeart />
					{:else}
						<FaRegHeart />
					{/if}
				</div>
				<div class="font-medium text-sm">
					{project?.expand?.['project_votes(project)'].length ?? ''}
				</div>
			</a>
		{/if}
	{/if}
</form>
