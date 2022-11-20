<script lang="ts">
	import type { Record } from 'pocketbase';
	import { SimpleAutoComplete } from '$lib/components';

	export let items: Record[];

	export let selectedItems: any[];
	export let selectedItemValues: string[];
	export let selectName = '';
</script>

<SimpleAutoComplete
	{selectName}
	multiple={true}
	{items}
	labelFieldName="name"
	valueFieldName="id"
	bind:selectedItem={selectedItems}
	bind:value={selectedItemValues}
	text=""
/>
