import { serialize } from 'object-to-formdata';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { ClientResponseError } from 'pocketbase';
import { validateData } from '$lib/utils';
import { createProjectDto } from '$lib/schemas';
import type { Project } from '$lib/types';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const { formData, errors } = await validateData(
			await request.formData(),
			createProjectDto.pick({ url: true })
		);
		let projectId;
		if (errors) {
			return invalid(400, {
				data: formData,
				errors: errors.fieldErrors
			});
		}
		try {
			const { id } = await locals.pb
				.collection('projects')
				.create<Project>({ user: locals?.user?.id, ...formData });
			projectId = id;
		} catch (err) {
			console.log('Error:', err);
			const e = err as ClientResponseError;
			throw error(e.status, e.data.message);
		}

		throw redirect(303, `/projects/${projectId}/edit`);
	}
};
