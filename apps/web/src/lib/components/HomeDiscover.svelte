<script lang="ts">
	import type { Project } from '$lib/types';
	import ProjectsGrid from './ProjectsGrid.svelte';
	export let projects: Project[];
</script>

<div class="w-full">
	<h3 class="font-bold font-heading text-2xl mb-4">Trending Projects</h3>
	<ProjectsGrid {projects} />
</div>
