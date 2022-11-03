import { serialize } from 'object-to-formdata';
import { error, invalid } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { ClientResponseError } from 'pocketbase';
import { validateData } from '../../../lib/helpers';
import { createProjectDto } from '$lib/schemas';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const { formData, errors } = await validateData(request, createProjectDto);

		if (errors) {
			return invalid(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}
		try {
			await locals.pb.collection('projects').create(serialize(formData));
		} catch (err) {
			console.log('Error:', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.data.message);
		}
	}
};
