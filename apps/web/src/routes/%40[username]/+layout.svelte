<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar, ProfileSocialIcons } from '$lib/components';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const navigation = [
		{
			title: 'Projects',
			href: `/@${data.profile.username}`
		},
		{
			title: 'Activity',
			href: `/@${data.profile.username}/activity`
		},
		{
			title: 'Collections',
			href: `/@${data.profile.username}/collections`
		}
	];
</script>

<div class="w-full h-full mt-4 flex flex-col max-w-7xl items-center">
	<div class="flex flex-col space-x-4 items-center mb-6 ">
		<Avatar user={data.profile} classes="w-24 h-24 mb-3" />
		<h2 class="text-xl font-semibold ">{data.profile.name}</h2>
		<p class="opacity-80 mb-2">@{data.profile.username}</p>
		{#if data.profile.bio}
			<p class="max-w-3xl text-center mb-3">{data.profile.bio}</p>
		{/if}
		<ProfileSocialIcons profile={data.profile} />
	</div>
	<div class="tabs justify-between w-1/4 font-medium">
		{#each navigation as navItem}
			<a
				href={navItem.href}
				class="tab tab-bordered {$page.url.pathname === navItem.href ? 'tab-active ' : ''}"
				>{navItem.title}</a
			>
		{/each}
	</div>

	<slot />
</div>
