import { validateData } from '$lib/utils';
import { updatePasswordDto } from '$lib/schemas';
import { error, invalid } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { ClientResponseError } from 'pocketbase';

export const actions: Actions = {
	updatePassword: async ({ request, locals }) => {
		const { formData, errors } = await validateData(await request.formData(), updatePasswordDto);

		if (errors) {
			return invalid(400, {
				errors
			});
		}
		try {
			await locals.pb.collection('users').update(locals?.user?.id as string, formData);
		} catch (err) {
			const e = err as ClientResponseError;
			console.log('Error: ', e.data.data);
			throw error(e.status, e.data.message);
		}

		return {
			success: true
		};
	}
};
