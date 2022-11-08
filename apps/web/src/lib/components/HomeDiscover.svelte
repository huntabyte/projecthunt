<script lang="ts">
	import type { Project } from '$lib/types';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	export let projects: Project[];
</script>

<div class="w-full">
	<h3 class="font-bold text-2xl mb-4">Discover</h3>
	<div
		class="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 lg:gap-x-8"
	>
		{#each projects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</div>
