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
		Create a new project
	</h2>
	<p class="text-center mt-1">
		Or <a href="/login" class="text-primary font-medium hover:cursor-pointer">sign in</a> if you already
		have an account.
	</p>
	<div class="bg-white py-6 shadow-md rounded-lg w-full max-w-sm mt-6">
		<form method="POST" action="?/register" class="flex flex-col items-center space-y-2 w-full">
			<div class="form-control w-full max-w-xs">
				<label for="name" class="label font-medium pb-1">
					<span class="label-text">Name</span>
				</label>
				<input
					type="text"
					name="name"
					class="input input-bordered w-full max-w-xs mb-2"
					value={form?.data?.name ?? ''}
				/>
				{#if form?.errors?.name}
					{#each form?.errors?.name as error}
						<label for="name" class="label py-0">
							<div class="label-text-alt text-error">{error}</div>
						</label>
					{/each}
				{/if}
			</div>
			<div class="form-control w-full max-w-xs">
				<label for="email" class="label font-medium pb-1">
					<span class="label-text">Email</span>
				</label>
				<input
					type="email"
					name="email"
					class="input input-bordered w-full max-w-xs mb-2"
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
			<div class="form-control w-full max-w-xs">
				<label for="password" class="label font-medium pb-1">
					<span class="label-text">Password</span>
				</label>
				<input type="password" name="password" class="input input-bordered w-full max-w-xs mb-2" />
				{#if form?.errors?.password}
					{#each form?.errors?.password as error}
						<label for="name" class="label py-0">
							<div class="label-text-alt text-error">{error}</div>
						</label>
					{/each}
				{/if}
			</div>
			<div class="form-control w-full max-w-xs">
				<label for="passwordConfirm" class="label font-medium pb-1">
					<span class="label-text">Confirm Password</span>
				</label>
				<input
					type="password"
					name="passwordConfirm"
					class="input input-bordered w-full max-w-sm mb-2"
				/>
				{#if form?.errors?.passwordConfirm}
					{#each form?.errors?.passwordConfirm as error}
						<label for="name" class="label py-0">
							<div class="label-text-alt text-error">{error}</div>
						</label>
					{/each}
				{/if}
			</div>
			<div class="w-full max-w-xs pt-3">
				<button class="btn btn-primary w-full max-w-xs">Register</button>
			</div>
		</form>
	</div>
</div>
