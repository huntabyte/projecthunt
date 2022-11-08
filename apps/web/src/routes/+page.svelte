<script lang="ts">
	import HomeDiscover from '$lib/components/HomeDiscover.svelte';
	import HomeHeader from '$lib/components/HomeHeader.svelte';
	import ProjectListItem from '$lib/components/ProjectListItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full mt-4 space-y-6">
	<HomeHeader />
	<HomeDiscover projects={data.projects.items} />
</div>
