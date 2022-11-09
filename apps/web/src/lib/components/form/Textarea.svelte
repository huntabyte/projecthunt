<script lang="ts">
	export let value: string = '';
	export let placeholder: string = '';
	export let id: string;
	export let label: string;
	export let disabled: boolean = false;
	export let required: boolean = false;

	export let errors: string[];
</script>

<div class="form-control w-full max-w-lg">
	<label for={id} class="label font-medium pb-1">
		<span class="label-text">{label}</span>
	</label>
	<textarea
		class="textarea textarea-bordered h-24 resize-none mb-2"
		name={id}
		{id}
		{value}
		{placeholder}
		{required}
		{disabled}
	/>
	{#if errors}
		{#each errors as error}
			<label for={id} class="label py-0">
				<div class="label-text-alt text-error">{error}</div>
			</label>
		{/each}
	{/if}
</div>
