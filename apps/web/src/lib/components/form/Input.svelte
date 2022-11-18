<script lang="ts">
	export let value: string = '';
	export let placeholder: string = '';
	export let id: string;
	export let label: string;
	export let type: string = 'text';
	export let disabled: boolean = false;
	export let required: boolean = false;

	export let errors: string[] = [];

	interface $$Props extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['input']> {
		name: string;
		placeholder: string;
	}
</script>

<div class="form-control w-full max-w-lg mb-2">
	<label for={id} class="label font-medium pb-1">
		<span class="label-text">{label}</span>
	</label>
	<input
		class="input input-bordered w-full max-w-lg mb-2"
		name={id}
		{type}
		{id}
		{value}
		{placeholder}
		{required}
		{disabled}
	/>
	{#if errors.length > 0}
		{#each errors as error}
			<label for={id} class="label py-0">
				<div class="label-text-alt text-error">{error}</div>
			</label>
		{/each}
	{/if}
</div>
