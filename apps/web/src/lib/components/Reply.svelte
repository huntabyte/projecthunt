<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import type { Comment, Reply } from '$lib/types';
	import FaEllipsisH from 'svelte-icons/fa/FaEllipsisH.svelte';
	import Avatar from './Avatar.svelte';
	import { generateRelativeDate } from '$lib/utils';
	import CommentReplyForm from '$lib/components/CommentReplyForm.svelte';

	export let comment: Comment;
	export let reply: Reply;
	export let showEdit: boolean;
	export let editId: string | null;
	export let toggleDropdown: Function;
	export let toggleEdit: Function;
	let showReply: boolean;

	$: showReply = false;

	interface Dropdown {
		id: string;
		hidden: boolean;
	}

	export let dropdown: Dropdown;
	const timestamp = generateRelativeDate(new Date(reply.created));
</script>

<div class="flex w-full space-x-4 my-4" id={reply.id}>
	<Avatar user={reply.expand.user} />
	<div class="flex flex-col w-full">
		<div class="flex items-center space-x-2">
			<p class="font-bold">{reply.expand.user.name}</p>
			<p class="font-light opacity-90">@{reply.expand.user.username}</p>
		</div>
		<div class="mt-2">
			{#if showEdit && editId === reply.id}
				<a href="#{reply.id}" class="hidden absolute -top-20">Anchor</a>
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
					<input type="hidden" value={reply.id} name="id" />
					<div class="flex flex-col">
						<input
							type="text"
							value={reply.content}
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
				<p>{reply.content}</p>
			{/if}
		</div>
		<div class="flex space-x-4 mt-2 text-sm font-semibold items-center ">
			<span class="hover:cursor-pointer hover:underline opacity-80">Upvote</span>
			<button
				class="hover:cursor-pointer hover:underline opacity-80"
				on:click={() => (showReply = !showReply)}>Reply</button
			>
			<span class="hover:cursor-pointer hover:underline opacity-80">Share</span>
			<span class="opacity-80">{timestamp}</span>
			<div class="dropdown dropdown-top ">
				<button
					class="btn btn-ghost btn-circle btn-xs"
					on:click={() => toggleDropdown(reply.id, false)}
				>
					<div class="w-4 h-4">
						<FaEllipsisH />
					</div>
				</button>
				<ul
					class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 {dropdown.id ===
						reply.id && dropdown.hidden
						? 'hidden'
						: ''}"
				>
					{#if $page.data?.user?.id === reply.user}
						<li>
							<form
								action="?/showEdit"
								class="w-full"
								method="POST"
								use:enhance={({ cancel }) => {
									toggleEdit(reply.id);
									cancel();
								}}
							>
								<input type="hidden" name="editId" value={reply.id} />
								<button
									type="submit"
									class="w-full text-start"
									on:click={() => toggleDropdown(reply.id, true)}>Edit</button
								>
							</form>
						</li>
					{/if}
					{#if $page.data?.user?.id === reply.user || $page.data?.user?.id === $page.data.project.user}
						<li>
							<form action="?/deleteReply" class="w-full" method="POST" use:enhance>
								<input type="hidden" name="id" value={reply.id} />
								<button
									type="submit"
									class="w-full text-start"
									on:click={() => toggleDropdown(reply.id, true)}>Delete</button
								>
							</form>
						</li>
					{/if}
					{#if $page.data?.user?.id !== reply.user}
						<li><a href="/">Report</a></li>
					{/if}
				</ul>
			</div>
		</div>
		{#if showReply}
			<CommentReplyForm {comment} />
		{/if}
	</div>
</div>
