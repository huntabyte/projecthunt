import { validateData } from '$lib/utils';
import { updateEmailDto, updateUsernameDto } from '$lib/schemas';
import { error, invalid } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { ClientResponseError } from 'pocketbase';
import type { UpdateAccountActionData } from '$lib/types';

export const actions: Actions = {
	updateEmail: async ({ request, locals }): Promise<UpdateAccountActionData> => {
		const { formData, errors } = await validateData(await request.formData(), updateEmailDto);

		if (errors) {
			return invalid(400, {
				data: formData,
				errors: {
					emailErrors: errors.fieldErrors
				}
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
	},
	updateUsername: async ({ request, locals }): Promise<UpdateAccountActionData> => {
		const { formData, errors } = await validateData(await request.formData(), updateUsernameDto);

		if (errors) {
			return invalid(400, {
				data: formData,
				errors: {
					usernameErrors: errors.fieldErrors
				}
			});
		}

		try {
			await locals.pb.collection('users').update(locals.user?.id as string, formData);
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
