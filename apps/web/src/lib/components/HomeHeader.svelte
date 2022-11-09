<script lang="ts">
	import SearchInput from '$lib/components/form/SearchInput.svelte';
	import HeaderImage from './svg/HeaderImage.svelte';
</script>

<div class="lg:h-104 lg:flex lg:items-center">
	<div class="w-full text-center lg:text-left lg:w-1/2 lg:-mt-8">
		<h1 class="text-3xl font-normal leading-normal md:text-5xl ">
			Discover, discuss, and build <span class="font-bold">community</span> around your next
			favorite <span class="font-bold">project.</span>
		</h1>
		<p class="mt-4 text-lg">
			ProjectHunt is a place where you can discover new projects to use, contribute to, or build
			community around.
		</p>
		<SearchInput id="search" placeholder="Search Projects" />
	</div>
	<div class="w-full mt-4 lg:mt-0 lg:w-1/2">
		<div
			class="w-full h-full max-w-lg mx-auto transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-120  duration-300"
		>
			<HeaderImage />
		</div>
	</div>
</div>
