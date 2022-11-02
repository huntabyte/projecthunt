import { z, ZodError } from 'zod';
import { zfd } from 'zod-form-data';
import { serialize } from 'object-to-formdata';
import { error, redirect, invalid } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { ProjectDto } from '$lib/types';
import { projectDto } from '$lib/schemas';
import { ClientResponseError } from 'pocketbase';




export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		let formObj: ProjectDto;
		let formData;
		try {
			formObj.user = locals.user.id;
			formObj = projectDto.parse(await request.formData());

			if (formObj.thumbnail.size === 0) {
				console.log('empty');
				const { thumbnail, ...rest } = formObj;
				formData = serialize(rest);
			} else {
				formData = serialize(formObj);
			}

			try {
				const updatedRecord = await locals.pb
					.collection('projects')
					.update(params.projectId, formData);
			} catch (err) {
				console.log('Error:', err);
				throw error(500, 'Something went wrong during project submission');
			}
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();

				return invalid(400, {
					data: formObj,
					errors
				});
			} else {
				console.log('Error:', err);
				throw error(500, 'Something went wrong');
			}
		}

		throw redirect(303, '/my/projects');
	},
	delete: async ({ locals, params }) => {
		try {
			await locals.pb.collection('projects').update(params.projectId, {
				thumbnail: null
			});
		} catch (err) {
      if (err instanceof ClientResponseError) {
        throw error(err.status, err.data.message)
      }
			throw error(500, 'Something went wrong');
		}
		return {
			success: true
		};
	}
};
