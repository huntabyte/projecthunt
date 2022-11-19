<script lang="ts">
	import { CommentIcon } from '$lib/components/icons';

	import { getImageURL } from '$lib/utils';
	import type { Project } from '$lib/types';
	import ConfirmDeleteModal from '$lib/components/ConfirmDeleteModal.svelte';

	export let project: Project;
</script>

<div class="bg-base-100 w-full h-28 p-4 flex items-center justify-between">
	<div class="avatar">
		<div class="w-20 rounded">
			<img
				src={project.thumbnail
					? getImageURL(project.collectionName, project.id, project.thumbnail, '80x80')
					: 'https://via.placeholder.com/80'}
				alt="Project thumbnail"
			/>
		</div>
	</div>
	<div class="flex flex-col w-full ml-4 h-full justify-between">
		<a href="/projects/{project.id}" class="font-semibold text-lg flex items-center">
			{project.name || project.url}
			{#if !project.published}
				<span class="badge badge-warning ml-2">DRAFT</span>
			{/if}
		</a>
		<p>{project.tagline}</p>
		<div class="flex items-center">
			<span class="text-md">
				<CommentIcon />
			</span>
			<div>
				<p class="ml-1 text-sm font-medium">0</p>
			</div>
		</div>
	</div>
	<div class="flex items-center justify-end w-full space-x-2">
		<a href="/projects/{project.id}/edit" class="btn btn-outline"
			>{project.published ? 'Edit Project' : 'Edit Draft'}</a
		>
		<ConfirmDeleteModal {project} />
	</div>
</div>
