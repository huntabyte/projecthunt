<script lang="ts">
	import FaSearch from 'svelte-icons/fa/FaSearch.svelte';
	export let value: string = '';
	export let placeholder: string = '';
	export let id: string;
	export let type: string = 'search';
</script>

<div
	class="mt-6 bg-transparent border rounded-lg lg:w-2/3 focus-within:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-20"
>
	<form action="" class="flex flex-wrap justify-between md:flex-row">
		<input
			class="flex-1 h-10 px-4 m-1 text-neutral-focus placeholder-base-content/50 bg-transparent border-none appearance-none lg:h-12 focus:outline-none focus:placeholder-transparent focus:ring-0"
			name={id}
			{type}
			{id}
			{value}
			{placeholder}
		/>
		<button
			type="submit"
			class="flex items-center justify-center w-full p-2 m-1 text-white transition-colors duration-300 transform rounded-lg lg:w-12 lg:h-12 lg:p-0 bg-primary hover:bg-primary/70 focus:outline-none focus:bg-primary/70"
		>
			<div class="w-6 h-6">
				<FaSearch />
			</div>
		</button>
	</form>
</div>
