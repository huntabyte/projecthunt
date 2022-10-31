<script>
	import { getImageURL } from '$lib/helpers';
	import ProjectVoteForm from '$lib/components/ProjectVoteForm.svelte';
	export let data;
	export let form;
</script>

<div class="flex flex-col w-full min-w-full">
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
	<div class="flex mt-4 w-full justify-center items-center space-x-4">
		<div class="avatar">
			<div class="w-24 rounded-full">
				<img src="https://placeimg.com/192/192/people" alt="User Avatar" />
			</div>
		</div>
		<form
			action="?/createComment"
			method="POST"
			class="flex w-full justify-between min-w-full space-x-4"
		>
			<input type="hidden" value={data.project.id} name="project" />
			<div class="w-full">
				<input
					type="text"
					placeholder="What do you think?"
					class="input input-ghost w-full"
					name="content"
					value={form?.data?.content ?? ''}
				/>
			</div>
			<div class="w-full">
				<button type="submit" class="btn btn-primary">Comment</button>
			</div>
		</form>
	</div>
</div>
