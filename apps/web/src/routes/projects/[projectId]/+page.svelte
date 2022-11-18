<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import ProjectVoteForm from '$lib/components/ProjectVoteForm.svelte';
	import { Carousel } from 'flowbite-svelte';

	import { getImageURL } from '$lib/utils';
	import type { ActionData, PageData } from './$types';
	import Comment from '$lib/components/Comment.svelte';
	export let form: ActionData;
	export let data: PageData;

	let showEdit: boolean;
	const toggleEdit = (id: string) => {
		showEdit = true;
		editId = id;
	};

	const toggleDropdown = (id: string, bool: boolean) => {
		dropdown.id = id;
		dropdown.hidden = bool;
	};

	let showThumbs = false;
	let showCaptions = false;
	let divClass = 'overflow-hidden relative h-56 rounded-lg sm:h-96 xl:h-128 ';
	let images = data.project.images?.map((image, idx) => {
		return {
			imgurl: getImageURL(data.project.collectionId, data.project.id, image),
			id: idx,
			name: image,
			attribution: ''
		};
	});

	$: showEdit = Boolean(data?.showEdit);
	$: editId = data?.editId;
	$: dropdown = {
		id: '',
		hidden: false
	};
</script>

<div class="flex flex-col w-full max-w-screen-lg mx-auto">
	<div class="flex">
		<div class="avatar">
			<div class="w-20 rounded">
				<img
					src={getImageURL(data.project.collectionName, data.project.id, data.project.thumbnail)}
					alt="Project Thumbnail"
				/>
			</div>
		</div>
	</div>
	<a href={data.project.url} class="text-2xl font-bold mt-4 hover:underline max-w-max"
		>{data.project.name}</a
	>
	<div class="flex justify-between mt-2">
		<p class="text-2xl font-light">{data.project.tagline}</p>
		<div class="flex ">
			<div class="h-10 w-10">
				<ProjectVoteForm project={data.project} />
			</div>
		</div>
	</div>
	<div class="mt-4 space-y-4">
		<p class="text-lg">{data.project.description}</p>
	</div>
	{#if images}
		{#if images.length > 0}
			<div class="mt-6">
				<Carousel {images} loop {showCaptions} {showThumbs} duration={5000} {divClass} />
			</div>
		{/if}
	{/if}
	{#if data.user}
		<div class="flex mt-4 w-full  items-center space-x-4">
			<div class="avatar">
				<div class="w-12 rounded-full">
					<img
						src={data.user?.avatar
							? getImageURL(data.user?.collectionName, data.user?.id, data.user?.avatar)
							: `https://ui-avatars.com/api/?name=${data?.user?.name}`}
						alt="User Avatar"
					/>
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
				<div class="w-full">
					<input type="hidden" name="user" value={data?.user?.id} />
					<input type="hidden" name="project" value={data?.project?.id} />
					<input
						type="text"
						placeholder="What do you think?"
						class="input input-ghost w-full mb-2"
						name="content"
						value={form?.data?.content ?? ''}
					/>
					{#if form?.errors?.content}
						{#each form?.errors?.content as error}
							<label for="name" class="label py-0">
								<div class="label-text-alt text-error">{error}</div>
							</label>
						{/each}
					{/if}
				</div>
				<div class="ml-4">
					<button type="submit" class="btn btn-primary">Comment</button>
				</div>
			</form>
		</div>
	{:else}
		<div class="flex mt-4 w-full  items-center space-x-4">
			<a href="/login" class="font-medium text-primary hover:cursor-pointer hover:underline">
				Login to join the conversation
			</a>
		</div>
	{/if}
	<div class="flex flex-col mt-8 w-full space-y-8">
		{#each data.comments as comment}
			<Comment {toggleEdit} {toggleDropdown} {dropdown} {showEdit} {editId} {comment} />
		{/each}
	</div>
</div>
