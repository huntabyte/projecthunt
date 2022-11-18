import { updateProjectImagesDto } from '$lib/schemas';
import { validateFormData } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { Actions } from './$types';

export const actions: Actions = {
	uploadImages: async ({ request, locals, params }) => {
		const { formData, errors } = await validateFormData(
			await request.formData(),
			updateProjectImagesDto
		);

		try {
			await locals.pb.collection('projects').update(params.projectId, formData);
			if (errors) {
				return {
					success: false,
					errors: errors.fieldErrors
				};
			}
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.data.data.images);
		}

		return {
			success: true,
			errors: undefined
		};
	},
	deleteImage: async ({ request, locals, params }) => {
		const { imageName } = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('projects').update(params.projectId, {
				[`images.` + imageName]: null
			});
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.message);
		}

		return {
			sucess: true,
			errors: undefined
		};
	}
};
