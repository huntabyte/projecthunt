<script lang="ts">
	import { getImageURL } from '$lib/helpers';
	import type { Project } from '$lib/types';
	import FaComment from 'svelte-icons/fa/FaComment.svelte';
	import FaRegHeart from 'svelte-icons/fa/FaRegHeart.svelte';

	export let project: Project;
</script>

<div class="card card-compact bg-base-100 shadow-xl ">
	<figure class="h-48 ">
		<img
			class="object-cover object-center w-full h-full"
			src={getImageURL(project.collectionName, project.id, project.thumbnail)}
			alt="Shoes"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			{project.name}
		</h2>
		<p>{project.tagline}</p>
		<div class="card-actions justify-end">
			<div class="flex items-center">
				<span class="mr-2 font-medium">0</span>
				<div class="w-5 h-5">
					<FaRegHeart />
				</div>
			</div>
		</div>
	</div>
</div>
