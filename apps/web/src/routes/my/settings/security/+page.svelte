<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Input from '$lib/components/form/Input.svelte';
	import toast from 'svelte-french-toast';
	let loading = false;

	const submitUpdatePassword: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					toast.success('Password updated successfully!');
					await invalidateAll();
					break;
				case 'error':
					toast.error('Could not change password. Please check your credentials and try again.');
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
		<form
			method="POST"
			action="?/updatePassword"
			class="flex flex-col space-y-2 w-full"
			use:enhance={submitUpdatePassword}
		>
			<h3 class="text-2xl font-medium">Change Password</h3>
			<div class="divider" />
			<Input id="oldPassword" label="Old Password" type="password" required disabled={loading} />
			<Input id="password" label="New Password" type="password" required disabled={loading} />
			<Input
				id="passwordConfirm"
				label="Confirm New Password"
				type="password"
				required
				disabled={loading}
			/>
			<a href="/reset-password" class="text-primary hover:cursor-pointer hover:underline"
				>I forgot my password</a
			>
			<div class="w-full max-w-lg pt-3">
				<button type="submit" class="btn btn-primary w-full max-w-lg" disabled={loading}
					>Update Password</button
				>
			</div>
		</form>
	</div>
</div>
