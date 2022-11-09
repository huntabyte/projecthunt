<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import type { Comment } from '$lib/types';
	import { getImageURL } from '$lib/utils';
	import FaEllipsisV from 'svelte-icons/fa/FaEllipsisV.svelte';
	import Avatar from './Avatar.svelte';

	export let comment: Comment;
	export let showEdit: boolean;
	export let editId: string | null;
	export let toggleDropdown: Function;
	export let toggleEdit: Function;

	interface Dropdown {
		id: string;
		hidden: boolean;
	}

	export let dropdown: Dropdown;
</script>

<div class="flex w-full space-x-4" id={comment.id}>
	<Avatar user={comment.expand.user} />
	<div class="flex flex-col">
		<div class="flex items-center space-x-2">
			<p class="font-bold">{comment.expand.user.name}</p>
			<p class="font-light opacity-90">@{comment.expand.user.username}</p>
		</div>
		<div class="mt-2">
			{#if showEdit && editId === comment.id}
				<a href="#{comment.id}" class="hidden absolute -top-20">Anchor</a>
				<form
					action="?/updateComment"
					method="POST"
					class="flex"
					use:enhance={({ form }) => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								form.reset();
							}
							if (result.type === 'invalid') {
								await applyAction(result);
							}
							update();
						};
					}}
				>
					<input type="hidden" value={comment.id} name="id" />
					<div class="flex flex-col">
						<input
							type="text"
							value={comment.content}
							class="input input-bordered input-primary"
							name="content"
						/>
						{#if $page.form?.updateErrors?.content}
							{#each $page.form?.updateErrors?.content as error}
								<label for="name" class="label py-0">
									<div class="label-text-alt text-error">{error}</div>
								</label>
							{/each}
						{/if}
					</div>
					<button class="btn ml-2">Update</button>
				</form>
			{:else}
				<p>{comment.content}</p>
			{/if}
		</div>
		<div class="flex space-x-4 mt-2 text-sm font-semibold items-center ">
			<span class="hover:cursor-pointer hover:underline">Upvote</span>
			<span class="hover:cursor-pointer hover:underline">Reply</span>
			<span class="hover:cursor-pointer hover:underline">Share</span>
			<div class="dropdown dropdown-top ">
				<button
					class="btn btn-ghost btn-circle btn-xs"
					on:click={() => toggleDropdown(comment.id, false)}
				>
					<div class="w-4 h-4">
						<FaEllipsisV />
					</div>
				</button>
				<ul
					class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 {dropdown.id ===
						comment.id && dropdown.hidden
						? 'hidden'
						: ''}"
				>
					{#if $page.data?.user?.id === comment.user}
						<li>
							<form
								action="?/showEdit"
								class="w-full"
								method="POST"
								use:enhance={({ cancel }) => {
									toggleEdit(comment.id);
									cancel();
								}}
							>
								<input type="hidden" name="editId" value={comment.id} />
								<button
									type="submit"
									class="w-full text-start"
									on:click={() => toggleDropdown(comment.id, true)}>Edit</button
								>
							</form>
						</li>
					{/if}
					{#if $page.data?.user?.id === comment.user || $page.data?.user?.id === $page.data.project.user}
						<li>
							<form action="?/deleteComment" class="w-full" method="POST" use:enhance>
								<input type="hidden" name="id" value={comment.id} />
								<button
									type="submit"
									class="w-full text-start"
									on:click={() => toggleDropdown(comment.id, true)}>Delete</button
								>
							</form>
						</li>
					{/if}
					{#if $page.data?.user?.id !== comment.user}
						<li><a href="/">Report</a></li>
					{/if}
				</ul>
			</div>
		</div>
	</div>
</div>
