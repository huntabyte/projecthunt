import type { NavigationItem } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const settingsNavigation: NavigationItem[] = [
		{
			title: 'Profile',
			href: '/my/settings/profile'
		},
		{
			title: 'Account',
			href: '/my/settings/account'
		},
		{
			title: 'Security',
			href: '/my/settings/security'
		}
	];

	return {
		navigation: settingsNavigation
	};
};
