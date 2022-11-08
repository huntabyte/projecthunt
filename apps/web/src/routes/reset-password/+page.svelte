<script lang="ts">
	import type { ActionData } from './$types';
	import DiCode from 'svelte-icons/di/DiCode.svelte';
	export let form: ActionData;
</script>

<div class="flex flex-col items-center h-full w-full pt-12">
	<div class="h-24 w-24 text-primary">
		<DiCode />
	</div>
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Reset your password
	</h2>
	<p class="text-center mt-1">We'll email you a link to reset your password.</p>
	<div class="bg-white py-6 shadow-md rounded-lg w-full max-w-sm mt-6">
		<form
			method="POST"
			action="?/resetPassword"
			class="flex flex-col items-center space-y-2 w-full"
		>
			<div class="form-control w-full max-w-xs">
				<label for="email" class="label font-medium pb-1">
					<span class="label-text">Email</span>
				</label>
				<input
					type="email"
					name="email"
					class="input input-bordered w-full max-w-xs"
					value={form?.data?.email ?? ''}
				/>
				{#if form?.errors?.email}
					{#each form?.errors?.email as error}
						<label for="name" class="label py-0">
							<div class="label-text-alt text-error">{error}</div>
						</label>
					{/each}
				{/if}
			</div>
			<div class="w-full max-w-xs pt-3 pb-2">
				<button class="btn btn-primary w-full max-w-xs">Login</button>
			</div>
		</form>
	</div>
</div>
