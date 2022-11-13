<script lang="ts">
	import { getImageURL } from '$lib/utils';
	import type { Project } from '$lib/types';
	import { CommentIcon } from '$lib/components/icons';

	import ProjectVoteForm from './ProjectVoteForm.svelte';

	export let project: Project;
</script>

<div class="card card-compact bg-base-100 shadow-lg ">
	<figure class="h-48 ">
		<img
			class="object-cover object-center w-full h-full"
			src={getImageURL(project.collectionName, project.id, project.thumbnail)}
			alt="Shoes"
		/>
	</figure>
	<div class="card-body gap-0">
		<a href="/projects/{project.id}" class="card-title">
			{project.name}
		</a>
		<p>{project.tagline}</p>
		<div class="card-actions justify-end space-x-2">
			<div class="flex items-center space-x-2">
				<div class="w-5 h-5 flex items-center">
					<span class="text-xl">
						<CommentIcon />
					</span>
				</div>
				<div>
					<p class="text-sm font-medium">0</p>
				</div>
			</div>
			<ProjectVoteForm {project} />
		</div>
	</div>
</div>
