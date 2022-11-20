<script lang="ts">
	import { ProjectCard } from '$lib/components';
	import type { Project } from '$lib/types';

	export let projects: Project[];
</script>

<div
	class="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 lg:gap-x-8"
>
	{#if projects.length > 0}
		{#each projects as project}
			<ProjectCard {project} />
		{/each}
	{/if}
</div>
