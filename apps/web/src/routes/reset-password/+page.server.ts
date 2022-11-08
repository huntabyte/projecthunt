import { validateData } from '$lib/helpers';
import { resetPasswordDto } from '$lib/schemas';
import { error, invalid, type Actions } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';

export const actions: Actions = {
	resetPassword: async ({ request, locals }) => {
		const { formData, errors } = await validateData(request, resetPasswordDto);

		if (errors) {
			return invalid(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			await locals.pb.collection('users').requestPasswordReset(formData.email);
			return {
				success: true
			};
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.data.message);
		}
	}
};
