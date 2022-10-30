import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { serialize } from 'object-to-formdata';
import { error, redirect, invalid } from '@sveltejs/kit';

const projectSchema = zfd.formData({
	name: z.string().min(1).max(40).trim(),
	tagline: z.string().min(1).max(60).trim(),
	url: z.string().url(),
	description: z.string().min(1).max(240).trim(),
	thumbnail: z.any()
});

export const actions = {
	update: async ({ request, locals, params }) => {
		let formObj;
		let formData;
		try {
			formObj = projectSchema.parse(await request.formData());
			formObj.user = locals.user.id;
			console.log(formObj);
			if (formObj.thumbnail.size === 0) {
				console.log('empty');
				const { thumbnail, ...rest } = formObj;
				formData = serialize(rest);
			} else {
				formData = serialize(formObj);
			}

			try {
				const updatedRecord = await locals.pb.records.update(
					'projects',
					params.projectId,
					formData
				);
			} catch (err) {
				console.log('Error:', err);
				throw error(500, 'Something went wrong during project submission');
			}
		} catch (err) {
			if (err?.status === 500) {
				throw error(500, 'Something went wrong during project submission');
			}
			const { fieldErrors: errors } = err.flatten();

			return invalid(400, {
				data: formObj,
				errors
			});
		}

		throw redirect(303, '/my/projects');
	},
	delete: async ({ locals, params }) => {
		try {
			await locals.pb.records.update('projects', params.projectId, {
				thumbnail: null
			});
		} catch (err) {
			console.log('Error:', err);
			throw error(err.status, 'Something went wrong');
		}
		return {
			success: true
		};
	}
};
