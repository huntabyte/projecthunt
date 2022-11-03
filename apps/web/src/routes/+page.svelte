<script lang="ts">
	import ProjectListItem from '$lib/components/ProjectListItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-3xl font-bold">Your next favorite project👋</h1>

<div class="w-full mt-4 space-y-6">
	{#each data.projects.items as project}
		<ProjectListItem {project} />
	{/each}
</div>
