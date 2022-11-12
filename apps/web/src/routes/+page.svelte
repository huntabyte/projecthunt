<script lang="ts">
	import { HomeDiscover, HomeHeader } from '$lib/components';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full mt-4 space-y-6">
	<HomeHeader />
	<HomeDiscover projects={data.projects.items} />
</div>
