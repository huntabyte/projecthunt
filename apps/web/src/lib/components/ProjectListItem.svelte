<script>
	import FaComment from 'svelte-icons/fa/FaComment.svelte';
	import FaCaretUp from 'svelte-icons/fa/FaCaretUp.svelte';
	import { getImageURL } from '$lib/helpers';

	export let project;
</script>

<div class="bg-base-100 w-full h-28 p-4 flex items-center justify-between">
	<div class="avatar">
		<div class="w-20 rounded">
			<img
				src={getImageURL(project['@collectionName'], project.id, project.thumbnail, '80x80')}
				alt="Project thumbnail"
			/>
		</div>
	</div>
	<div class="flex flex-col w-full ml-4 h-full justify-between">
		<div>
			<a href="/" class="font-semibold text-lg">{project.name}</a>
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
		<form action="?/vote" method="POST">
			<input type="hidden" value={project.id} name="id" />
			<button
				type="submit"
				class="btn btn-outline flex flex-col space-y-1 items-center justify-center p-3 h-auto z-10"
			>
				<div class="h-6 w-6">
					<FaCaretUp />
				</div>
				<div class="text-xs">299</div>
			</button>
		</form>
	</div>
</div>
