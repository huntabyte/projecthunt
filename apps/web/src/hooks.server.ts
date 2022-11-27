import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import type { User } from '$lib/types';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_PB_HOST } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(PUBLIC_PB_HOST);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		// get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
		}
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = serializeNonPOJOs<User>(event.locals.pb.authStore.model as User);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event);

	// TODO: secure before deployment
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};
