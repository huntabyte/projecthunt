<script>
	import { getImageURL } from '$lib/helpers';
	import ProjectVoteForm from '$lib/components/ProjectVoteForm.svelte';
	export let data;
</script>

<div class="flex flex-col">
	<div class="flex">
		<div class="avatar">
			<div class="w-20 rounded">
				<img
					src={getImageURL(
						data.project['@collectionName'],
						data.project.id,
						data.project.thumbnail
					)}
					alt="Project Thumbnail"
				/>
			</div>
		</div>
	</div>
	<h1 class="text-2xl font-bold mt-4">{data.project.name}</h1>
	<div class="flex justify-between mt-2">
		<p class="text-2xl font-light">{data.project.tagline}</p>
		<div class="flex space-x-2">
			<a
				href={data.project.url}
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-outline btn-lg">Visit</a
			>
			<ProjectVoteForm project={data.project} />
		</div>
	</div>
	<div class="mt-4 space-y-4">
		<p class="text-lg">{data.project.description}</p>
	</div>
</div>
