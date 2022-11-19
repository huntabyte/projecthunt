<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Input } from '$lib/components';
	export let form: ActionData;
</script>

<div class="flex justify-center w-full h-full p-2">
	<form
		method="POST"
		action="?/create"
		class="flex flex-col space-y-2 w-full items-center"
		enctype="multipart/form-data"
	>
		<h3 class="text-3xl font-bold">Post your project</h3>
		<p class="mt-2 5 text-lg">
			Working on something cool and need some help or just want to show it off? Get started below.
		</p>
		<Input id={'url'} label="Link to your project" errors={form?.errors?.url} />
		<div class="w-full max-w-lg pt-3">
			<button class="btn btn-primary w-full max-w-lg">Get Started</button>
		</div>
	</form>
</div>
