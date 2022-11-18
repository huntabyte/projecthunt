import { updateProjectImagesDto } from '$lib/schemas';
import { getProject } from '$lib/services/ProjectService';
import { validateFormData } from '$lib/utils';
import { error, invalid } from '@sveltejs/kit';
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
					errors: errors.fieldErrors
				};
			}
		} catch (err) {
			console.log('Error: ', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.message);
		}

		return {
			success: true
		};
	},
	deleteImage: async ({ request, locals, params }) => {
		const { imageName } = Object.fromEntries(await request.formData());
		console.log(imageName);

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
			sucess: true
		};
	}
};
