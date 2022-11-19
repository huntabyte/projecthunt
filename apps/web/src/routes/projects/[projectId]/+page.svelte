<script lang="ts">
	import { ProjectVoteForm, Comment, CommentCreateForm } from '$lib/components';
	import { Carousel } from 'flowbite-svelte';

	import { getImageURL } from '$lib/utils';
	import type { PageData } from './$types';
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
		<CommentCreateForm />
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
