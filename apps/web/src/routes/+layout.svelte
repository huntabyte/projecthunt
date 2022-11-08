<script lang="ts">
	import '../app.postcss';
	import { Toaster } from 'svelte-french-toast';
	import DiCode from 'svelte-icons/di/DiCode.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Toaster />
<div class="min-h-full">
	<div class="bg-base-100 border-b">
		<div class="navbar xl:container mx-auto bg-base-100 px-4">
			<div class="navbar-start">
				<div class="dropdown">
					<button class="btn btn-ghost md:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/></svg
						>
					</button>
					<ul
						class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
					>
						{#if data.user}
							<li>
								<form action="/logout" method="POST">
									<button>Logout</button>
								</form>
							</li>
						{:else}
							<li><a href="/login">Login</a></li>
							<li><a href="/register">Register</a></li>
						{/if}
					</ul>
				</div>
				<a
					href="/"
					class="h-12 w-12 text-xl text-base-100 hover:cursor-pointer bg-primary rounded-md"
				>
					<DiCode />
				</a>
			</div>
			<div class="navbar-end space-x-4">
				{#if data.user}
					<a
						href="/projects/new"
						class="text-primary font-bold hover:cursor-pointer hover:underline">Add Project</a
					>
					<div class="dropdown dropdown-end">
						<button class="btn btn-ghost btn-circle avatar">
							<div class="w-10 rounded-full">
								<img src="https://ui-avatars.com/api/?name={data.user.name}" alt="User " />
							</div>
						</button>
						<ul
							class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
						>
							<li>
								<a href="/">Profile</a>
							</li>
							<li><a href="/my/projects">My Projects</a></li>
							<li><a href="/my/settings/profile">Settings</a></li>
							<li>
								<form action="/logout" method="POST">
									<button type="submit">Logout</button>
								</form>
							</li>
						</ul>
					</div>
				{:else}
					<a href="/login" class="btn btn-outline">Login</a>
					<a href="/register" class="btn btn-primary btn-outline">Register</a>
				{/if}
			</div>
		</div>
	</div>
	<div class="h-full w-full lg:container mx-auto mt-8 px-8 max-w-xl">
		<slot />
	</div>
</div>
