import { validateData } from '$lib/helpers';
import { loginUserDto } from '$lib/schemas';
import type { LoginActionData } from '$lib/types';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }): Promise<LoginActionData> => {
		const { formData, errors } = await validateData(request, loginUserDto);

		if (errors) {
			return invalid(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}
		try {
			await locals.pb.collection('users').authWithPassword(formData.email, formData.password);
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					notVerified: true
				};
			}
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
