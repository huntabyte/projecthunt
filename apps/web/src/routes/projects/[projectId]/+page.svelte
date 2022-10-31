<script>
	import { enhance, applyAction } from '$app/forms';
	import { getImageURL } from '$lib/helpers';
	import ProjectVoteForm from '$lib/components/ProjectVoteForm.svelte';
	import { Result } from 'postcss';
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
	<div class="flex mt-4 w-full  items-center space-x-4">
		<div class="avatar">
			<div class="w-12 rounded-full">
				<img src="https://placeimg.com/192/192/people" alt="User Avatar" />
			</div>
		</div>
		<form
			action="?/createComment"
			method="POST"
			class="flex w-full justify-between max-w-lg"
			use:enhance={({ form }) => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						form.reset();
					}
					if (result.type === 'invalid') {
						await applyAction(result);
					}
					update();
				};
			}}
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
			<div class="ml-4">
				<button type="submit" class="btn btn-primary">Comment</button>
			</div>
		</form>
	</div>
	<div class="flex flex-col mt-8 w-full space-y-8">
		{#each data.comments as comment}
			<div class="flex w-full space-x-4">
				<div class="avatar h-max">
					<div class="w-12 rounded-full">
						<img src="https://placeimg.com/192/192/people" alt="User Avatar" />
					</div>
				</div>
				<div class="flex flex-col">
					<p class="font-bold">{comment.userProfile.name}</p>
					<div class="mt-2">
						<p>{comment.content}</p>
					</div>
					<div class="flex space-x-4 mt-2 text-sm font-medium  ">
						<p>Upvote</p>
						<p>Reply</p>
						<p>Share</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
