<script lang="ts">
	import type { Project } from '$lib/types';

	export let project: Project;
</script>

<label for="confirmDelete" class="btn btn-error btn-outline">Delete</label>

<input type="checkbox" id="confirmDelete" class="modal-toggle" />
<label for="confirmDelete" class="modal modal-bottom sm:modal-middle">
	<label class="modal-box" for="">
		<h3 class="font-bold text-xl text-center">Are you sure you want to delete {project.name}?</h3>
		<p class="my-2 text-lg text-center">
			Once this project has been deleted, all comments, upvotes, and images will be permanently
			removed.
		</p>
		<div class="modal-action justify-center">
			<label for="confirmDelete" class="btn btn-primary">Cancel</label>
			<form action="?/deleteProject" method="POST">
				<input type="hidden" value={project.id} name="id" />
				<button type="submit" class="btn btn-error">Delete</button>
			</form>
		</div>
	</label>
</label>
