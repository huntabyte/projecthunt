import { z, ZodError } from 'zod';
import { zfd } from 'zod-form-data';
import { serialize } from 'object-to-formdata';
import { error, redirect, invalid } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ClientResponseError } from 'pocketbase';
import { projectDto } from '$lib/schemas';
import type { ProjectDto } from '$lib/types';



export const actions: Actions = {
	create: async ({ request, locals }) => {
		let project: ProjectDto
		try {
			project = projectDto.parse(await request.formData());
			project.user = locals.user.id;
			const formData = serialize(project);

			try {
				const record = await locals.pb.collection('projects').create(formData);
			} catch (err) {
        throw err
			}
		} catch (err) {
      if (err instanceof ClientResponseError) {
        throw error(err.status, err.data.message)
      }
      if (err instanceof ZodError) {
        const { fieldErrors: errors } = err.flatten();
        return invalid(400, {
          data: project,
          errors
        });
      }

      throw error(500, 'Something went wrong while creating a project.')
		}

		throw redirect(303, '/');
	}
};
