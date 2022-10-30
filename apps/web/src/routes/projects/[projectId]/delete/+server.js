import { redirect } from '@sveltejs/kit';

export const POST = async ({ url, locals, params }) => {
	try {
		await locals.pb.records.update('projects', params.projectId, {
			thumbnail: null
		});
	} catch (err) {
		console.log('Error:', err);
	}

	throw redirect(303, `/projects/${params.projectId}/edit`);
};
