<script lang="ts">
	import { TwitterIcon, GitHubIcon, YouTubeIcon } from '$lib/components/icons';
	import type { User } from '$lib/types';
	export let profile: User;
</script>

<div class="flex justify-center space-x-3 md:order-2 text-xl">
	{#if profile.twitter}
		<a
			href={profile.twitter}
			target="_blank"
			rel="noopener noreferrer"
			class="text-neutral hover:text-neutral-focus"
		>
			<TwitterIcon />
		</a>
	{/if}
	{#if profile.github}
		<a
			href={profile.github}
			target="_blank"
			rel="noopener noreferrer"
			class="text-neutral hover:text-neutral-focus"
		>
			<GitHubIcon />
		</a>
	{/if}
	{#if profile.youtube}
		<a
			href={profile.youtube}
			target="_blank"
			rel="noopener noreferrer"
			class="text-neutral hover:text-neutral-focus"
		>
			<YouTubeIcon />
		</a>
	{/if}
</div>
