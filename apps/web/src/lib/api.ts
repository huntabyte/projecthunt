import { error, invalid, redirect } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import { serializeNonPOJOs, validateData } from '$lib/helpers';
import type { Comment, CommentActionData, Project, Vote } from '$lib/types';
import { createCommentDto, createProjectDto, updateCommentDto } from '$lib/schemas';
import { serialize } from 'object-to-formdata';

export const getProject = async (locals: App.Locals, id: string): Promise<Project> => {
	const project = serializeNonPOJOs<Project>(
		await locals.pb.collection('projects').getOne(id, {
			expand: 'votes(project)'
		})
	);
	if (project.expand?.['votes(project)']) {
		return project;
	}
	project.expand['votes(project)'] = [];

	return project;
};

export const getProjects = async (locals: App.Locals, page = 1, perPage = 100) => {
	try {
		let projects = serializeNonPOJOs(
			await locals.pb.collection('projects').getList<Project>(page, perPage, {
				sort: '-created',
				expand: 'votes(project)'
			})
		);
		projects.items = projects.items.map((project) => {
			if (project.expand?.['votes(project)']) {
				return project;
			}
			project.expand['votes(project)'] = [];
			return project;
		});
		return projects;
	} catch (err) {
		console.log('Error:', err);
		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		} else {
			throw error(500, 'Something went wrong with fetching the projects.');
		}
	}
};

export const getUsersProjects = async (locals: App.Locals) => {
	try {
		const projects = serializeNonPOJOs<Project[]>(
			await locals.pb.collection('projects').getFullList(undefined, {
				filter: `user = "${locals?.user?.id}"`
			})
		);
		return projects;
	} catch (err) {
		console.log('Error:', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}
};

export const getAllProjects = async (locals: App.Locals) => {
	try {
		let projects = serializeNonPOJOs(
			await locals.pb.collection('projects').getFullList<Project>(999999999, {
				sort: '-created',
				expand: 'votes(project)'
			})
		);
		projects = projects.map((project) => {
			if (project.expand?.['votes(project)']) {
				return project;
			}
			project.expand['votes(project)'] = [];
			return project;
		});
		return projects;
	} catch (err) {
		console.log('Error:', err);
		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		} else {
			throw error(500, 'Something went wrong with fetching the projects.');
		}
	}
};

export const updateProject = async (
	locals: App.Locals,
	request: Request,
	projectId: string,
	redirectTo: string
) => {
	let data = await request.formData();

	if (data.get('thumbnail') === '') {
		data.delete('thumbnail');
	}

	const { formData, errors } = await validateData(data, createProjectDto);
	let serializedFormData: FormData;
	const { thumbnail, ...rest } = formData;

	if (errors) {
		return invalid(400, {
			data: rest,
			errors: errors.fieldErrors
		});
	}

	try {
		formData.user = locals?.user?.id;

		if (formData?.thumbnail?.size === 0) {
			console.log('empty');
			const { thumbnail, ...rest } = formData;
			serializedFormData = serialize(rest);
		} else {
			serializedFormData = serialize(formData);
		}
		await locals.pb.collection('projects').update(projectId, serializedFormData);
	} catch (err) {
		console.log('Error:', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}

	throw redirect(303, redirectTo);
};

export const getComments = async (locals: App.Locals, projectId: string) => {
	const comments = serializeNonPOJOs<Comment[]>(
		await locals.pb.collection('comments').getFullList<Comment>(undefined, {
			filter: `project = "${projectId}"`,
			expand: 'user'
		})
	);
	return comments;
};

export const createComment = async (
	locals: App.Locals,
	request: Request
): Promise<CommentActionData> => {
	const { formData, errors } = await validateData(await request.formData(), createCommentDto);

	if (errors) {
		return invalid(400, {
			data: formData,
			errors: errors.fieldErrors
		});
	}

	try {
		await locals.pb.collection('comments').create(formData);
		return {
			success: true
		};
	} catch (err) {
		console.log('Error:', err);

		const e = err as ClientResponseError;

		throw error(e.status, e.data.message);
	}
};

export const updateComment = async (
	locals: App.Locals,
	request: Request
): Promise<CommentActionData> => {
	const { formData, errors } = await validateData(await request.formData(), updateCommentDto);

	if (errors) {
		return invalid(400, {
			updateData: formData,
			updateErrors: errors.fieldErrors
		});
	}

	try {
		await locals.pb.collection('comments').update(formData.id, formData);
		return {
			success: true
		};
	} catch (err) {
		console.log('Error:', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}
};

export const vote = async (locals: App.Locals, projectId: string) => {
	try {
		const existingVote = await locals.pb.collection('votes').getFullList<Vote>(1, {
			filter: `user = "${locals?.user?.id}" && project = "${projectId}"`,
			sort: '-created'
		});
		if (existingVote.length < 1) {
			await locals.pb.collection('votes').create({
				user: locals?.user?.id,
				project: projectId
			});
		} else {
			const vote = serializeNonPOJOs(existingVote[0]);
			await locals.pb.collection('votes').delete(vote.id);
		}
	} catch (err) {
		console.log('Error:', err);
		throw error(500, 'Something went wrong with voting.');
	}
};

export const deleteRecord = async (
	locals: App.Locals,
	collectionName: string,
	recordId: string,
	redirectTo: string
) => {
	try {
		await locals.pb.collection(collectionName).delete(recordId as string);
	} catch (err) {
		console.log('Error:', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}
	throw redirect(303, redirectTo);
};
