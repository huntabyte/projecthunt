<script>
	import MyProjectItem from '$lib/components/MyProjectItem.svelte';

	export let data;
</script>

<h2 class="text-3xl font-bold">My Projects</h2>
<div class="w-full mt-4 space-y-6 flex flex-col  items-center">
	{#if data.projects.length === 0}
		<p class="text-center text-3xl">☹️</p>
		<p class="text-center text-3xl">Looks like you don't have any projects.</p>
		<a href="/projects/new" class="btn btn-primary max-w-md">Add One</a>
	{/if}
	{#each data.projects as project}
		<MyProjectItem {project} />
	{/each}
</div>
