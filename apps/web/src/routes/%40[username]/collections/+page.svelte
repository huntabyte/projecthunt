<script lang="ts">
	import { ProjectsGrid } from '$lib/components';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="w-full mt-6">
	<h3 class="font-medium">Liked Projects</h3>
	<div class="divider" />
	<ProjectsGrid projects={data.projects} />
</div>
