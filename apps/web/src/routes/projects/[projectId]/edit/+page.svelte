<script lang="ts">
	import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte';
	import { getImageURL } from '$lib/utils';
	import { Autocomplete, Input } from '$lib/components';
	import type { ActionData, PageData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	const technologies = data.project.expand['projects_technologies(project)'].map((record) => {
		return record.expand.technology;
	});

	const topics = data.project.expand['projects_topics(project)'].map((record) => {
		return record.expand.topic;
	});
</script>

<div class="flex flex-col w-full h-full p-2">
	<div class="w-full px-8">
		<form
			method="POST"
			action="?/update"
			class="flex flex-col space-y-2 w-full"
			enctype="multipart/form-data"
		>
			<h3 class="text-3xl font-bold">Tell us more about this project</h3>
			<p class="mt-2 5 text-lg">We'll need the name, tagline, link, and description</p>
			<Input
				id="name"
				value={data.project.name ?? form?.data?.name}
				errors={form?.errors?.name}
				label="Project name"
			/>
			<Input
				id="tagline"
				value={data.project.tagline ?? form?.data?.tagline}
				errors={form?.errors?.tagline}
				label="Project tagline"
			/>
			<Input
				id="url"
				value={data.project.url ?? form?.data?.url}
				errors={form?.errors?.url}
				label="Project URL"
			/>
			<div class="form-control w-full max-w-lg">
				<label for="description" class="label font-medium pb-1">
					<span class="label-text">Project description</span>
				</label>
				<textarea
					name="description"
					class="textarea textarea-bordered h-24 resize-none"
					value={data.project.description ?? form?.data?.description}
				/>
			</div>
			<div class="form-control w-full max-w-lg">
				<label for="technologies" class="label font-medium pb-1">
					<span class="label-text">Technologies</span>
				</label>
				<Autocomplete
					items={data.technologies}
					selectName="technologies"
					selectedItems={technologies}
					selectedItemValues={['']}
				/>
			</div>
			<div class="form-control w-full max-w-lg">
				<label for="topics" class="label font-medium pb-1">
					<span class="label-text">Topics</span>
				</label>
				<Autocomplete
					items={data.topics}
					selectName="topics"
					selectedItems={topics}
					selectedItemValues={['']}
				/>
			</div>
			<div class="form-control w-full max-w-lg">
				<label for="thumbnail" class="label font-medium pb-1">
					<span class="label-text">Thumbnail</span>
				</label>
				<label for="thumbnail" class="avatar w-20 hover:cursor-pointer">
					{#if data.project.thumbnail}
						<label for="thumbnail" class="absolute -top-0.5 -right-0.5 hover:cursor-pointer">
							<button formaction="?/delete" class="w-5 h-5">
								<FaRegTrashAlt />
							</button>
						</label>
						<div class="w-20 rounded">
							<img
								src={getImageURL(
									data.project.collectionName,
									data.project.id,
									data.project.thumbnail
								)}
								alt="Project thumbnail"
							/>
						</div>
					{/if}
				</label>
				<input type="file" name="thumbnail" id="thumbnail" value="" />
			</div>
			<div class="w-full max-w-lg pt-3">
				<button class="btn btn-primary w-full max-w-lg">Save Changes</button>
			</div>
		</form>
	</div>
</div>
