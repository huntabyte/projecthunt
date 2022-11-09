<script lang="ts">
	import type { ActionData } from './$types';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/form/Input.svelte';
	export let form: ActionData;

	// const submitUpdateProfile: SubmitFunction = () => {
	// 	loading = true;
	// 	return async ({ result }) => {
	// 		switch (result.type) {
	// 			case 'success':
	// 				toast.success('Updated profile!');
	// 				await invalidateAll();
	// 				break;
	// 			case 'error':
	// 				toast.error('Something went wrong updating your profile');
	// 				break;
	// 			default:
	// 				await applyAction(result);
	// 		}
	// 		loading = false;
	// 	};
	// };
</script>

<div class="flex flex-col w-full h-full ">
	<div class="w-full ">
		<h3 class="text-2xl font-medium">Change Email</h3>
		<div class="divider" />
		<Modal label="change-email">
			<span slot="trigger">Change Email</span>
			<h3 slot="heading">Change Your Email</h3>
			<form action="?/updateEmail" method="POST" class="space-y-2">
				<Input
					id="email"
					type="email"
					required={true}
					value={form?.data?.email}
					label="Enter your new email"
				/>
				<button type="submit" class="btn btn-primary w-full">Change my email</button>
			</form>
		</Modal>
	</div>
</div>
