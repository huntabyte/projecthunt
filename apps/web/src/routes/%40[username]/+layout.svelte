<script lang="ts">
	import { Avatar } from '$lib/components';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="w-full h-full mt-4 flex flex-col">
	<div class="flex space-x-4 items-center">
		<Avatar user={data.profile} classes="w-24 h-24" />
		<div class="flex flex-col">
			<h2 class="text-xl font-medium mb-1">{data.profile.name}</h2>
			<p class="text-sm opacity-80">@{data.profile.username}</p>
		</div>
	</div>

	<slot />
</div>
