<script lang="ts">
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;
</script>

<div class="flex flex-col items-center h-full w-full pt-12">
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Create a new project🆕
	</h2>
	<p class="text-center mt-1">We'll need the following information to make this happen</p>
	<form
		method="POST"
		action="?/create"
		class="flex flex-col items-center space-y-2 w-full pt-4"
		enctype="multipart/form-data"
	>
		<div class="form-control w-full max-w-md">
			<label for="name" class="label font-medium pb-1">
				<span class="label-text">Name</span>
			</label>
			<input
				type="text"
				name="name"
				class="input input-bordered w-full max-w-md mb-2"
				value={form?.data?.name ?? ''}
			/>
			{#if form?.errors?.name}
				{#each form?.errors?.name as error}
					<label for="name" class="label py-0">
						<div class="label-text-alt text-error">{error}</div>
					</label>
				{/each}
			{/if}
		</div>
		<div class="form-control w-full max-w-md">
			<label for="tagline" class="label font-medium pb-1">
				<span class="label-text">Tagline</span>
			</label>
			<input
				type="text"
				name="tagline"
				class="input input-bordered w-full max-w-md mb-2"
				value={form?.data?.tagline ?? ''}
			/>
			{#if form?.errors?.tagline}
				{#each form?.errors?.tagline as error}
					<label for="name" class="label py-0">
						<div class="label-text-alt text-error">{error}</div>
					</label>
				{/each}
			{/if}
		</div>
		<div class="form-control w-full max-w-md">
			<label for="url" class="label font-medium pb-1">
				<span class="label-text">URL</span>
			</label>
			<input
				type="text"
				name="url"
				class="input input-bordered w-full max-w-md mb-2"
				value={form?.data?.url ?? ''}
			/>
			{#if form?.errors?.url}
				{#each form?.errors?.url as error}
					<label for="name" class="label py-0">
						<div class="label-text-alt text-error">{error}</div>
					</label>
				{/each}
			{/if}
		</div>
		<div class="form-control w-full max-w-md">
			<label for="description" class="label font-medium pb-1">
				<span class="label-text">Description</span>
			</label>
			<textarea
				name="description"
				class="textarea textarea-bordered h-24 resize-none mb-2"
				value={form?.data?.description ?? ''}
			/>
			{#if form?.errors?.description}
				{#each form?.errors?.description as error}
					<label for="name" class="label py-0">
						<div class="label-text-alt text-error">{error}</div>
					</label>
				{/each}
			{/if}
		</div>
		<div class="form-control w-full max-w-md">
			<label for="thumbnail" class="label font-medium pb-1">
				<span class="label-text">Thumbnail</span>
			</label>
			<input
				type="file"
				name="thumbnail"
				class="file-input file-input-bordered file-input-primary w-full max-w-md file-input-md mb-2"
				accept="image/*"
			/>
			{#if form?.errors?.thumbnail}
				{#each form?.errors?.thumbnail as error}
					<label for="name" class="label py-0">
						<div class="label-text-alt text-error">{error}</div>
					</label>
				{/each}
			{/if}
		</div>
		<input type="hidden" name="user" value={data?.user?.id} />
		<div class="w-full max-w-md pt-3">
			<button class="btn btn-primary w-full max-w-md">Add Project</button>
		</div>
	</form>
</div>
