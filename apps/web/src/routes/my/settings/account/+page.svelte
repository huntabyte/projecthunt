<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/form/Input.svelte';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import toast from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';
	export let form: ActionData;
	export let data: PageData;
	export let loading = false;
	let emailModalOpen: boolean;
	let usernameModalOpen: boolean;

	$: emailModalOpen = false;
	$: usernameModalOpen = false;

	const submitUpdateEmail: SubmitFunction = () => {
		loading = true;
		emailModalOpen = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					toast.success(
						'Email change request successful! You must verify your new email before the change takes place'
					);
					await invalidateAll();
					emailModalOpen = false;
					break;
				case 'error':
					toast.error('Something went wrong updating your profile');
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

	const submitUpdateUsername: SubmitFunction = () => {
		loading = true;
		usernameModalOpen = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					toast.success('Username changed!');
					await invalidateAll();
					usernameModalOpen = false;
					break;
				case 'error':
					toast.error('Something went wrong changing your username');
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="flex flex-col w-full h-full space-y-12">
	<div class="w-full ">
		<h3 class="text-2xl font-medium">Change Email</h3>
		<div class="divider" />
		<Modal label="change-email" checked={emailModalOpen}>
			<button slot="trigger" class="btn btn-primary">Change Email</button>
			<h3 slot="heading">Change Your Email</h3>
			<form action="?/updateEmail" method="POST" class="space-y-2" use:enhance={submitUpdateEmail}>
				<Input
					id="email"
					type="text"
					required={true}
					value={form?.data?.email}
					label="Enter your new email"
					disabled={loading}
					errors={form?.errors?.emailErrors?.email}
				/>
				<button type="submit" class="btn btn-primary w-full" disabled={loading}
					>Change my email</button
				>
			</form>
		</Modal>
	</div>
	<div class="w-full ">
		<h3 class="text-2xl font-medium">Change Username</h3>
		<div class="divider mb-0.5" />
		<Input id="username" label="Username" value={data.user?.username} disabled />
		<Modal label="change-username" checked={usernameModalOpen}>
			<span slot="trigger" class="btn btn-primary">Change Username</span>
			<h3 slot="heading">Change Your Username</h3>
			<form
				action="?/updateUsername"
				method="POST"
				class="space-y-2"
				use:enhance={submitUpdateUsername}
			>
				<Input
					id="username"
					type="text"
					required={true}
					value={form?.data?.username}
					label="Choose your new username"
					disabled={loading}
					errors={form?.errors?.usernameErrors?.username}
				/>
				<button type="submit" class="btn btn-primary w-full" disabled={loading}
					>Change my username</button
				>
			</form>
		</Modal>
	</div>
</div>
