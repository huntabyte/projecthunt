import { createProjectDto } from '$lib/schemas';
import type { Project, Vote } from '$lib/types';
import { serializeNonPOJOs, validateData } from '$lib/utils';
import { error, invalid, redirect } from '@sveltejs/kit';
import { serialize } from 'object-to-formdata';
import { ClientResponseError } from 'pocketbase';

export const getProject = async (locals: App.Locals, id: string): Promise<Project> => {
	const project = serializeNonPOJOs<Project>(
		await locals.pb.collection('projects').getOne(id, {
			expand: 'project_votes(project)'
		})
	);
	if (project.expand?.['project_votes(project)']) {
		return project;
	}
	project.expand['project_votes(project)'] = [];

	return project;
};

export const getProjects = async (locals: App.Locals, page = 1, perPage = 100) => {
	try {
		let projects = serializeNonPOJOs(
			await locals.pb.collection('projects').getList<Project>(page, perPage, {
				sort: '-created',
				expand: 'project_votes(project)'
			})
		);
		projects.items = projects.items.map((project) => {
			if (project.expand?.['project_votes(project)']) {
				return project;
			}
			project.expand['project_votes(project)'] = [];
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
				expand: 'project_votes(project)'
			})
		);
		projects = projects.map((project) => {
			if (project.expand?.['project_votes(project)']) {
				return project;
			}
			project.expand['project_votes(project)'] = [];
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

export const updateProjectVote = async (locals: App.Locals, projectId: string) => {
	try {
		const existingVote = await locals.pb.collection('project_votes').getFullList<Vote>(1, {
			filter: `user = "${locals?.user?.id}" && project = "${projectId}"`,
			sort: '-created'
		});
		if (existingVote.length < 1) {
			await locals.pb.collection('project_votes').create({
				user: locals?.user?.id,
				project: projectId
			});
		} else {
			const vote = serializeNonPOJOs(existingVote[0]);
			await locals.pb.collection('project_votes').delete(vote.id);
		}
	} catch (err) {
		console.log('Error:', err);
		throw error(500, 'Something went wrong with voting.');
	}
};
