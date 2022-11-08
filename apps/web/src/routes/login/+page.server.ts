import { validateData } from '$lib/helpers';
import { loginUserDto } from '$lib/schemas';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const { formData, errors } = await validateData(request, loginUserDto);

		if (errors) {
			return invalid(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}
		try {
			await locals.pb.collection('users').authWithPassword(formData.email, formData.password);
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;

			const { password, ...rest } = formData;

			return {
				data: rest,
				invalidCredentials: true
			};
		}
		throw redirect(303, '/');
	}
};
