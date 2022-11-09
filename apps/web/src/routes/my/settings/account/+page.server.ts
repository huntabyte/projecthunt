import { validateData } from '$lib/utils';
import { updateEmailDto } from '$lib/schemas';
import { error, invalid } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { ClientResponseError } from 'pocketbase';

export const actions: Actions = {
	updateEmail: async ({ request, locals }) => {
		const { formData, errors } = await validateData(await request.formData(), updateEmailDto);

		if (errors) {
			return invalid(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			await locals.pb.collection('users').requestEmailChange(formData.email);
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.data.message);
		}

		return {
			success: true,
			data: formData
		};
	}
};
