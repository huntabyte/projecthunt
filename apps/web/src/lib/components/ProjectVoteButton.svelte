<script lang="ts">
	import { page } from '$app/stores';
	import { HeartSolidIcon, HeartOutlineIcon } from '$lib/components/icons';
	import type { Project } from '$lib/types';

	export let hasVoted: boolean;
	export let project: Project;
</script>

{#if $page.data?.user}
	<button
		type="submit"
		class="flex space-x-2 items-center justify-center {hasVoted ? 'text-primary' : 'text-base'}"
	>
		<div class="w-5 h-5 flex items-center">
			<span class="text-xl">
				{#if hasVoted}
					<HeartSolidIcon />
				{:else}
					<HeartOutlineIcon />
				{/if}
			</span>
		</div>
		<div class="font-medium text-sm">
			{project?.expand?.['project_votes(project)'].length ?? ''}
		</div>
	</button>
{:else}
	<a href="/login" class="flex space-x-2 items-center justify-center text-base">
		<div class="w-5 h-5 flex items-center">
			<span class="text-xl">
				<HeartOutlineIcon />
			</span>
		</div>
		<div class="font-medium text-sm">
			{project?.expand?.['project_votes(project)'].length ?? ''}
		</div>
	</a>
{/if}
