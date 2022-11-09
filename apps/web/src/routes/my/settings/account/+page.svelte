<script lang="ts">
	import type { ActionData } from './$types';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/form/Input.svelte';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import toast from 'svelte-french-toast';
	import { goto, invalidateAll } from '$app/navigation';
	export let form: ActionData;
	export let loading = false;
	export let checked: boolean;

	$: checked = false;

	const submitUpdateEmail: SubmitFunction = () => {
		loading = true;
		checked = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					toast.success(
						'Email change request successful! You must verify your new email before the change takes place'
					);
					await invalidateAll();
					checked = false;
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
</script>

<div class="flex flex-col w-full h-full ">
	<div class="w-full ">
		<h3 class="text-2xl font-medium">Change Email</h3>
		<div class="divider" />
		<Modal label="change-email" {checked}>
			<span slot="trigger">Change Email</span>
			<h3 slot="heading">Change Your Email</h3>
			<form action="?/updateEmail" method="POST" class="space-y-2" use:enhance={submitUpdateEmail}>
				<Input
					id="email"
					type="text"
					required={true}
					value={form?.data?.email}
					label="Enter your new email"
					disabled={loading}
					errors={form?.errors?.email}
				/>
				<button type="submit" class="btn btn-primary w-full" disabled={loading}
					>Change my email</button
				>
			</form>
		</Modal>
	</div>
</div>
