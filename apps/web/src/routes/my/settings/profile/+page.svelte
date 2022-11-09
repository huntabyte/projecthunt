<script lang="ts">
	import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte';
	import { getImageURL } from '$lib/utils';
	import type { ActionData, PageData } from './$types';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import toast from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';
	import Input from '$lib/components/form/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	export let data: PageData;
	export let form: ActionData;

	export let loading = false;

	let checked: boolean;
	let usernameDisabled: boolean;

	$: checked = false;
	$: usernameDisabled = true;

	const showPreview = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const files = target.files as FileList;

		if (files.length > 0) {
			const src = URL.createObjectURL(files[0]);
			const preview = document.getElementById('avatar-preview') as HTMLImageElement;
			preview.src = src;
			preview.style.display = 'block';
		}
	};

	const submitUpdateProfile: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					toast.success('Updated profile!');
					await invalidateAll();
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
		<form
			method="POST"
			action="?/updateProfile"
			class="flex flex-col space-y-2 w-full"
			enctype="multipart/form-data"
			use:enhance={submitUpdateProfile}
		>
			<h3 class="text-3xl font-bold">Profile Settings</h3>
			<div class="divider" />
			<div class="form-control w-full max-w-lg">
				<label for="avatar" class="label font-medium pb-1">
					<span class="label-text">Profile Picture</span>
				</label>
				<label for="avatar" class="avatar w-32 rounded-full hover:cursor-pointer">
					<label for="avatar" class="absolute -bottom-0.5 -right-0.5 hover:cursor-pointer">
						<span
							class="btn btn-circle btn-sm btn-secondary transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200"
						>
							<div class="w-4 h-4 ">
								<FaPencilAlt />
							</div>
						</span>
					</label>
					<div class="w-32 rounded-full">
						<img
							id="avatar-preview"
							src={data.user?.avatar
								? getImageURL(data.user.collectionName, data.user.id, data?.user?.avatar)
								: `https://ui-avatars.com/api/?name=${data?.user?.name}`}
							alt="user avatar"
						/>
					</div>
				</label>
				<input
					type="file"
					name="avatar"
					id="avatar"
					value=""
					accept="image/*"
					hidden
					on:change={showPreview}
				/>
			</div>
			<Input
				id="name"
				label="Name"
				value={form?.data?.name ?? data.user?.name}
				required
				errors={form?.errors?.name}
			/>

			<div class="w-full max-w-lg pt-3">
				<button class="btn btn-primary w-full max-w-lg">Update Profile</button>
			</div>
		</form>
	</div>
</div>
