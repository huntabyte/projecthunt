<script lang="ts">
	interface $$Props extends Partial<svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['input']>> {
		id: string;
		errors?: string[];
		label: string;
	}
	export let id: string;
	export let label: string;

	export let errors: string[] | undefined = [];
</script>

<div class="form-control w-full max-w-lg mb-2">
	<label for={id} class="label font-medium pb-1">
		<span class="label-text">{label}</span>
	</label>
	<input class="input input-bordered w-full max-w-lg mb-2" name={id} {...$$restProps} />
	{#if errors}
		{#if errors.length > 0}
			{#each errors as error}
				<label for={id} class="label py-0">
					<div class="label-text-alt text-error">{error}</div>
				</label>
			{/each}
		{/if}
	{/if}
</div>
