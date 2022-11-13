import { updateProjectImagesDto } from '$lib/schemas';
import { validateData } from '$lib/utils';
import { error, invalid } from '@sveltejs/kit';
import { serialize } from 'object-to-formdata';
import type { ClientResponseError } from 'pocketbase';
import type { Actions } from './$types';

export const actions: Actions = {
	uploadImages: async ({ request, locals, params }) => {
		const formData = await request.formData();
		console.log(Object.fromEntries(formData));

		try {
			await locals.pb.collection('projects').update(params.projectId, formData);
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.message);
		}

		return {
			success: true
		};
	}
};
