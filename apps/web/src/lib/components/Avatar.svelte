<script lang="ts">
	import type { User } from '$lib/types';
	import { getImageURL } from '$lib/utils';

	export let user: User;
	export let classes = 'w-12 h-12';
</script>

<div class="avatar h-max">
	<div class={classes + ' ' + 'rounded-full'}>
		<img
			src={user?.avatar
				? getImageURL(user?.collectionName, user?.id, user?.avatar)
				: `https://ui-avatars.com/api/?name=${user?.name}`}
			alt="User Avatar"
		/>
	</div>
</div>
