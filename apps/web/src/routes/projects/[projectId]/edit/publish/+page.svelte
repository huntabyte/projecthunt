<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import toast from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';

	const handlePublishProject: SubmitFunction = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success('Your project is live!');
					await invalidateAll();
					break;
				case 'error':
					toast.error(result.error.message);
					break;
				default:
					await update();
			}
			await update();
		};
	};
</script>

<div class="flex flex-col w-full h-full p-2">
	<div class="w-full px-8">
		<form
			method="POST"
			action="?/publishProject"
			class="flex flex-col space-y-2 w-full"
			enctype="multipart/form-data"
			use:enhance={handlePublishProject}
		>
			<h3 class="text-3xl font-bold">Publish Project</h3>
			<p class="mt-2 5 text-lg">Ready to go live? Let's publish your project.</p>
			<div class="w-full max-w-lg pt-3">
				<button class="btn btn-primary w-full max-w-lg">Publish Project</button>
			</div>
		</form>
	</div>
</div>
