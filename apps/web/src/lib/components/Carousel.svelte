<script lang="ts">
	import type { Project } from '$lib/types';
	import { getImageURL } from '$lib/utils';

	export let project: Project;
</script>

<div class="carousel w-full h-128">
	{#each project.images as image, idx}
		<div id={'item' + idx} class="carousel-item w-full">
			<img
				src={getImageURL(project.collectionId, project.id, image)}
				class="w-full"
				alt="Project image {idx}"
			/>
		</div>
	{/each}
</div>
<div class="flex justify-center w-full py-2 gap-2">
	{#each project.images as image, idx}
		<a href={'#item' + idx} class="btn btn-xs">{idx + 1}</a>
	{/each}
</div>
