<script lang="ts">
	import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte';
	import { getImageURL } from '$lib/utils';
	import type { ActionData, PageData } from './$types';
	export let data: PageData;
	export let form: ActionData;
</script>

<div class="flex flex-col w-full h-full p-2">
	<div class="w-full px-8">
		<form
			method="POST"
			action="?/uploadImages"
			class="flex flex-col space-y-2 w-full"
			enctype="multipart/form-data"
		>
			<h3 class="text-3xl font-bold">Gallery</h3>
			<p class="mt-2 5 text-lg">
				We recommend at least 3 images to properly showcase your project.
			</p>
			<div class="form-control w-full max-w-lg">
				<label for="images" class="block text-sm font-medium">Images</label>
				<div
					class="mt-1 flex justify-center rounded-md border-2 border-dashed border-base-300 px-6 pt-5 pb-6"
				>
					<div class="space-y-1 text-center">
						<svg
							class="mx-auto h-12 w-12 text-neutral"
							stroke="currentColor"
							fill="none"
							viewBox="0 0 48 48"
							aria-hidden="true"
						>
							<path
								d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<div class="flex text-sm text-base-content">
							<label
								for="images"
								class="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-focus"
							>
								<span>Upload images</span>
								<input
									id="images"
									name="images"
									type="file"
									accept="image/*"
									class="sr-only"
									multiple
								/>
							</label>
							<p class="pl-1">or drag and drop</p>
						</div>
						<p class="text-xs text-neutral">PNG, JPG, GIF up to 10MB</p>
					</div>
				</div>
			</div>

			<div class="w-full max-w-lg pt-3">
				<button class="btn btn-primary w-full max-w-lg">Edit Project</button>
			</div>
		</form>
	</div>
</div>
