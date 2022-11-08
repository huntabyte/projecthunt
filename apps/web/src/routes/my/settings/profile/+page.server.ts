import { validateData } from '$lib/helpers';
import { updateUserProfileDto } from '$lib/schemas';
import { error, invalid } from '@sveltejs/kit';
import { serialize } from 'object-to-formdata';
import type { Actions } from './$types';
import type { ClientResponseError } from 'pocketbase';

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const { formData, errors } = await validateData(await request.formData(), updateUserProfileDto);

		const { avatar, ...rest } = formData;

		if (errors) {
			return invalid(400, {
				data: rest,
				errors: errors.fieldErrors
			});
		}

		try {
			await locals.pb.collection('users').update(locals.user?.id as string, serialize(formData));
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.data.message);
		}

		return {
			success: true
		};
	}
};
