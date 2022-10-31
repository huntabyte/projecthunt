<script>
	export let data;
	console.log(data);
</script>

<div class="w-full h-full">
	<div class="w-full h-full">
		<h2 class="text-2xl font-bold">Project Name</h2>
		<p class="mt-1.5">Status: Published</p>
		<div class="divider" />
	</div>
</div>
<div class="flex w-full h-full">
	<ul class="menu w-96 rounded-box p-2 space-y-2">
		<li class="w-5/6">
			<a href="/projects/{data.project.id}/edit" class="active text-xl font-bold"> Main info </a>
		</li>
		<li class="w-5/6">
			<a href="/projects/{data.project.id}/edit" class="text-xl font-bold"> Images & Media </a>
		</li>
	</ul>

	<slot />
</div>
