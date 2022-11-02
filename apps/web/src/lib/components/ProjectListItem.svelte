<script lang="ts">
	import FaComment from 'svelte-icons/fa/FaComment.svelte';
	import { getImageURL } from '$lib/helpers';
	import ProjectVoteForm from './ProjectVoteForm.svelte';
	import type { Project } from '$lib/types';

	export let project: Project;
</script>

<div class="bg-base-100 w-full h-28 p-4 flex items-center justify-between">
	<div class="avatar">
		<div class="w-20 rounded">
			<img
				src={getImageURL(project.collectionName, project.id, project.thumbnail, '80x80')}
				alt="Project thumbnail"
			/>
		</div>
	</div>
	<div class="flex flex-col w-full ml-4 h-full justify-between">
		<div>
			<a href="/projects/{project.id}" class="font-semibold text-lg">{project.name}</a>
			<p>{project.tagline}</p>
		</div>
		<div class="flex items-center">
			<div class="w-3 h-3">
				<FaComment />
			</div>
			<div>
				<p class="ml-1 text-sm font-medium">0</p>
			</div>
		</div>
	</div>
	<div>
		<ProjectVoteForm {project} />
	</div>
</div>
