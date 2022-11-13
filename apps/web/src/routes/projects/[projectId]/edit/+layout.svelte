<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const navigation = [
		{
			title: 'Main info',
			href: `/projects/${data.project.id}/edit`
		},
		{
			title: 'Images & Media',
			href: `/projects/${data.project.id}/edit/images`
		}
	];
</script>

<div class="w-full h-full">
	<div class="w-full h-full">
		<h2 class="text-2xl font-bold">Project Name</h2>
		<p class="mt-1.5">Status: Published</p>
		<div class="divider" />
	</div>
</div>
<div class="flex w-full h-full">
	<ul class="menu w-96 rounded-box p-2 space-y-2">
		{#each navigation as navItem}
			<li>
				<a
					href={navItem.href}
					class="{$page.url.pathname === navItem.href ? 'active' : ''} text-xl font-bold"
				>
					{navItem.title}
				</a>
			</li>
		{/each}
	</ul>

	<slot />
</div>
