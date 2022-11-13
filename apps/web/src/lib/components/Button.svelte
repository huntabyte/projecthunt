<script lang="ts">
	export let href: string = '';
	export let classes: string = '';
	export let disabled: boolean = false;
</script>

<svelte:element this={href ? 'a' : 'button'} {disabled} {href} class="btn {classes}">
	<slot />
</svelte:element>
