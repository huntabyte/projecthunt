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
		},
		{
			title: 'Publish',
			href: `/projects/${data.project.id}/edit/publish`
		}
	];
</script>

<div class="w-full h-full">
	<div class="w-full h-full">
		<h2 class="text-2xl font-bold">{data.project.name}</h2>
		<p class="mt-1">
			Status:
			{#if data.project.published}
				<span class=" font-medium text-success">Published</span>
			{:else}
				<span class="font-medium text-warning">Draft</span>
			{/if}
		</p>
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
