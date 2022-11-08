import { registerUserDto } from '$lib/schemas';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ClientResponseError } from 'pocketbase';
import { ZodError } from 'zod';
import { validateData } from '$lib/helpers';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const { formData, errors } = await validateData(request, registerUserDto);

		if (errors) {
			console.log(errors.fieldErrors);
			return invalid(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		try {
			await locals.pb.collection('users').create(formData);
			await locals.pb.collection('users').requestVerification(formData.email);
		} catch (err) {
			console.log('Error:', err);
			if (err instanceof ClientResponseError) {
				throw error(err.status, err.data.message);
			}
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();
				return {
					data: formData,
					errors
				};
			}
		}

		throw redirect(303, '/login');
	}
};
