import { validateData } from '$lib/helpers';
import { updateUserProfileDto } from '$lib/schemas';
import { error, invalid } from '@sveltejs/kit';
import { serialize } from 'object-to-formdata';
import type { Actions } from './$types';
import type { ClientResponseError } from 'pocketbase';

export const actions: Actions = {
	update: async ({ request, locals }) => {
		let data = await request.formData();
		const userAvatar = data.get('avatar') as Blob;

		if (userAvatar.size === 0) {
			data.delete('avatar');
		}

		const { formData, errors } = await validateData(data, updateUserProfileDto);
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
