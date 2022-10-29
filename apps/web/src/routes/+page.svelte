<script>
	import ProjectListItem from '$lib/components/ProjectListItem.svelte';

	export let data;
</script>

<h1 class="text-3xl font-bold">Your next favorite project👋</h1>

<div class="w-full mt-4 space-y-6">
	{#each data.projects.items as project}
		<ProjectListItem {project} />
	{/each}
</div>
