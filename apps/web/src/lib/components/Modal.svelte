<script lang="ts">
	export let label: string;
</script>

<label for={label} class=" btn btn-primary">
	<slot name="trigger" />
</label>

<input type="checkbox" id={label} class="modal-toggle" />
<label for={label} class="modal modal-bottom sm:modal-middle">
	<label class="modal-box" for="">
		<div class="font-bold text-xl text-center">
			<slot name="heading" />
		</div>
		<div class="my-2">
			<slot />
		</div>
		<div class="modal-action justify-center">
			<slot name="actions" />
		</div>
	</label>
</label>
