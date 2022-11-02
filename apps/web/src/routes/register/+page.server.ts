import { registerUserDto } from '$lib/schemas';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ClientResponseError } from 'pocketbase';
import { ZodError } from 'zod';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const formData = registerUserDto.parse(await request.formData())

		try {
			await locals.pb.collection('users').create(formData);
		} catch (err) {
      console.log('Error:', err);
      if (err instanceof ClientResponseError) {
        throw error(err.status, err.data.message)
      }
      if (err instanceof ZodError) {
        const { fieldErrors: errors } = err.flatten()
        return {
          data: formData,
          errors
        };
      }
		}

		throw redirect(303, '/login');
	}
};
