import { loginUserDto } from '$lib/schemas';
import type { LoginUserDto } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import { ZodError } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
    let formData = Object.fromEntries(await request.formData())

    try {
      let loginUser = loginUserDto.parse(formData)
      await locals.pb.collection('users').authWithPassword(loginUser.email, loginUser.password);

		} catch (err) {
			if (err instanceof ZodError) {
        return {
          error: true,
          email: formData.email
        }
      }
      if (err instanceof ClientResponseError) {
        throw error(err.status, err.data.message)
      }
      throw error(500, 'Something went wrong logging in.')
		}
		throw redirect(303, '/');
	}
};
