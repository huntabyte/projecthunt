<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full h-full mt-4">
	<div class="flex">
		<div class="flex flex-col">
			<Avatar user={data.profile} classes="w-24 h-24" />
			<h2 class="text-xl font-medium">{data.profile.name}</h2>
			<p class=" text-sm opacity-80">@{data.profile.username}</p>
		</div>
	</div>
</div>
