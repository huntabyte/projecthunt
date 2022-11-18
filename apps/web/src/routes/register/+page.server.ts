import { registerUserDto } from '$lib/schemas';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ClientResponseError } from 'pocketbase';
import { ZodError } from 'zod';
import { generateUsername, validateData } from '$lib/utils';
import { usernameExists } from '$lib/helpers';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const { formData, errors } = await validateData(await request.formData(), registerUserDto);

		if (errors) {
			return invalid(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		let username = generateUsername(formData.name.split(' ').join('')).toLowerCase();

		do {
			username = generateUsername(formData.name.split(' ').join(''));
		} while (await usernameExists(locals.pb, username));

		try {
			await locals.pb.collection('users').create({ username, ...formData });
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
