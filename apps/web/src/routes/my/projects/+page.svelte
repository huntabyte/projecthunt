<script>
	import MyProjectItem from '$lib/components/MyProjectItem.svelte';

	export let data;
</script>

<h2 class="text-3xl font-bold">My Projects</h2>
<div class="w-full mt-4 space-y-6">
	{#each data.projects as project}
		<MyProjectItem {project} />
	{/each}
</div>
