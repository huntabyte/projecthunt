<script lang="ts">
	import type { ActionData } from './$types';
	import DiCode from 'svelte-icons/di/DiCode.svelte';
	import toast from 'svelte-french-toast';
	import { applyAction, enhance } from '$app/forms';
	export let form: ActionData;
</script>

<div class="flex flex-col items-center h-full w-full pt-12">
	<div class="h-24 w-24 text-primary">
		<DiCode />
	</div>
	<h2 class=" text-center text-3xl font-bold tracking-tight text-base-content">
		Register for an account
	</h2>
	<p class="text-center mt-1">
		Or <a href="/login" class="text-primary font-medium hover:cursor-pointer">sign in</a> if you already
		have an account.
	</p>
	<form
		method="POST"
		action="?/register"
		class="flex flex-col items-center space-y-2 w-full mt-4"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'invalid' || result.type === 'error') {
					await applyAction(result);
				} else {
					toast.success('Success! Please verify your email before you can login!');
					await update();
				}
			};
		}}
	>
		<div class="form-control w-full max-w-md">
			<label for="name" class="label font-medium pb-1">
				<span class="label-text">Name</span>
			</label>
			<input
				type="text"
				name="name"
				class="input input-bordered w-full max-w-md mb-2"
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
		<div class="form-control w-full max-w-md">
			<label for="email" class="label font-medium pb-1">
				<span class="label-text">Email</span>
			</label>
			<input
				type="email"
				name="email"
				class="input input-bordered w-full max-w-md mb-2"
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
		<div class="form-control w-full max-w-md">
			<label for="password" class="label font-medium pb-1">
				<span class="label-text">Password</span>
			</label>
			<input type="password" name="password" class="input input-bordered w-full max-w-md mb-2" />
			{#if form?.errors?.password}
				{#each form?.errors?.password as error}
					<label for="name" class="label py-0">
						<div class="label-text-alt text-error">{error}</div>
					</label>
				{/each}
			{/if}
		</div>
		<div class="form-control w-full max-w-md">
			<label for="passwordConfirm" class="label font-medium pb-1">
				<span class="label-text">Confirm Password</span>
			</label>
			<input
				type="password"
				name="passwordConfirm"
				class="input input-bordered w-full max-w-md mb-2"
			/>
			{#if form?.errors?.passwordConfirm}
				{#each form?.errors?.passwordConfirm as error}
					<label for="name" class="label py-0">
						<div class="label-text-alt text-error">{error}</div>
					</label>
				{/each}
			{/if}
		</div>
		<div class="w-full max-w-md pt-3">
			<button type="submit" class="btn btn-primary w-full max-w-md">Register</button>
		</div>
	</form>
</div>
