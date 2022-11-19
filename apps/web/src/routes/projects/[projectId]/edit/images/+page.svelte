<script lang="ts">
	import { TrashOutlineIcon } from '$lib/components/icons';
	import { Dropzone } from '$lib/components';
	import type { ActionData, PageData } from './$types';
	import { getImageURL } from '$lib/utils';
	import { enhance, type SubmitFunction } from '$app/forms';
	import toast from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;
	export let form: ActionData;

	let files = {
		accepted: [],
		rejected: []
	};

	let inputRef: HTMLInputElement;

	const handleFilesSelect = (e: CustomEvent<any>) => {
		const { acceptedFiles, fileRejections } = e.detail;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];
	};

	const handleDeleteImage = (idx: number) => {
		const dt = new DataTransfer();
		const { files: fileList } = inputRef;

		if (!fileList) {
			return;
		}

		for (let i = 0; i < fileList.length; i++) {
			const file = fileList?.[i];

			if (idx !== i) dt.items.add(file); // here you exclude the file. thus removing it.
		}

		inputRef.files = dt.files; // Assign the updates list

		files.accepted = files.accepted.filter((file, i) => i != idx);

		toast.success('Deleted image!');
	};

	const handleUpdateImages: SubmitFunction = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					files.accepted = [];
					break;
				case 'error':
					toast.error(result.error.message);
					break;
				default:
					await update();
			}
		};
	};
</script>

<div class="flex flex-col w-full h-full p-2">
	<div class="w-full px-8">
		<form
			method="POST"
			action="?/uploadImages"
			class="flex flex-col space-y-2 w-full"
			enctype="multipart/form-data"
			use:enhance={handleUpdateImages}
		>
			<h3 class="text-3xl font-bold">Gallery</h3>
			<p class="mt-2 5 text-lg">
				We recommend at least 3 images to properly showcase your project.
			</p>

			<Dropzone on:drop={handleFilesSelect} name="images" bind:inputRef />
			{#if form?.errors?.images}
				{#each form.errors.images as error}
					<label for="" class="label py-0">
						<div class="label-text-alt text-error">{error}</div>
					</label>
				{/each}
			{/if}
			<div class="grid grid-cols-5 gap-4 w-full mt-4">
				{#if data.project.images}
					{#each data.project.images as item, idx}
						<div class="relative">
							<form action="?/deleteImage" method="POST" use:enhance>
								<input type="hidden" value={item} name="imageName" />
								<button
									type="submit"
									class="absolute -top-1 -right-1 hover:cursor-pointer btn btn-circle btn-sm btn-secondary transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200 z-10"
								>
									<div class="w-4 h-4">
										<TrashOutlineIcon />
									</div>
								</button>
							</form>
							<div class="w-full aspect-w-16 aspect-h-9">
								<img
									src={getImageURL(data.project.collectionName, data.project.id, item)}
									alt="preview {idx}"
									class="object-fit h-full"
								/>
							</div>
						</div>
					{/each}
				{/if}
				{#each files.accepted as item, idx}
					<div class="relative">
						<button
							type="button"
							class="absolute -top-1 -right-1 hover:cursor-pointer btn btn-circle btn-sm btn-secondary transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200 z-10"
							on:click|preventDefault={() => handleDeleteImage(idx)}
						>
							<div class="w-4 h-4">
								<TrashOutlineIcon />
							</div>
						</button>
						<div class="w-full aspect-w-16 aspect-h-9">
							<img src={URL.createObjectURL(item)} alt="preview {idx}" class="object-fit h-full" />
						</div>
					</div>
				{/each}
			</div>

			<div class="w-full max-w-lg pt-3">
				<button class="btn btn-primary w-full max-w-lg">Save Changes</button>
			</div>
		</form>
	</div>
</div>
