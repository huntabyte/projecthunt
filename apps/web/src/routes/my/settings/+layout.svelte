<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="w-full h-full">
	<div class="w-full h-full">
		<h2 class="text-2xl font-bold">{data?.user?.name}</h2>
		<div class="divider" />
	</div>
</div>
<div class="flex w-full h-full">
	<ul class="menu w-96 rounded-box p-2 space-y-2">
		{#each data.navigation as nav}
			<li class="w-5/6">
				<a
					href={nav.href}
					class="{$page.url.pathname === nav.href ? 'active' : ''} text-xl font-bold">{nav.title}</a
				>
			</li>
		{/each}
	</ul>
	<div class="mt-4 w-full">
		<slot />
	</div>
</div>
