<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { ProjectsGrid } from '$lib/components';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full mt-6">
	<h3 class="font-medium">Recent Projects</h3>
	<div class="divider" />
	<ProjectsGrid projects={data.projects} />
</div>
