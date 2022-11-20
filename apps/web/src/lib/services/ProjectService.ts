import { createProjectDto, updateProjectTags } from '$lib/schemas';
import type { Project, ProjectVote, Technology } from '$lib/types';
import { serializeNonPOJOs, validateData } from '$lib/utils';
import { error, invalid, redirect } from '@sveltejs/kit';
import { serialize } from 'object-to-formdata';
import { ClientResponseError } from 'pocketbase';

export const getProject = async (locals: App.Locals, id: string): Promise<Project> => {
	try {
		const project = serializeNonPOJOs<Project>(
			await locals.pb.collection('projects').getOne(id, {
				expand:
					'project_votes(project), projects_technologies(project).technology, project_topics(project)'
			})
		);
		if (!project.expand?.['project_votes(project)']) {
			project.expand['project_votes(project)'] = [];
		}

		if (!project.expand?.['projects_technologies(project)']) {
			project.expand['projects_technologies(project)'] = [];
		}

		if (!project.expand?.['project_topics(project)']) {
			project.expand['project_topics(project)'] = [];
		}

		return project;
	} catch (err) {
		if (err instanceof ClientResponseError) {
			throw error(err.status, err.data.message);
		} else {
			throw error(500, 'Something went wrong getting the project');
		}
	}
};

export const getProjects = async (locals: App.Locals, filter: string = '') => {
	try {
		let projects = serializeNonPOJOs(
			await locals.pb.collection('projects').getFullList<Project>(undefined, {
				sort: '-created',
				expand:
					'project_votes(project), projects_technologies(project).technology, project_topics(project)',
				filter: filter
			})
		);
		projects = projects.map((project) => {
			if (!project.expand?.['project_votes(project)']) {
				project.expand['project_votes(project)'] = [];
			}

			if (!project.expand?.['projects_technologies(project)']) {
				project.expand['projects_technologies(project)'] = [];
			}

			if (!project.expand?.['project_topics(project)']) {
				project.expand['project_topics(project)'] = [];
			}
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
				expand:
					'project_votes(project), projects_technologies(project).technology, project_topics(project)'
			})
		);
		projects = projects.map((project) => {
			if (!project.expand?.['project_votes(project)']) {
				project.expand['project_votes(project)'] = [];
			}

			if (!project.expand?.['projects_technologies(project)']) {
				project.expand['projects_technologies(project)'] = [];
			}

			if (!project.expand?.['project_topics(project)']) {
				project.expand['project_topics(project)'] = [];
			}
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

	const thumb = data.get('thumbnail') as Blob;

	if (thumb.size === 0) {
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

	const { formData: tags } = await validateData(data, updateProjectTags, true);

	try {
		formData.user = locals?.user?.id;

		if (formData?.thumbnail?.size === 0) {
			const { thumbnail, ...rest } = formData;
			serializedFormData = serialize(rest);
		} else {
			serializedFormData = serialize(formData);
		}
		await locals.pb.collection('projects').update(projectId, serializedFormData);

		const currentTechnologies = serializeNonPOJOs(
			await locals.pb.collection('projects_technologies').getFullList(undefined, {
				filter: `project = "${projectId}"`
			})
		);

		let technologiesToDelete: string[] = [];
		let technologiesToCreate: string[] = [];

		currentTechnologies.forEach((record) => {
			if (!tags.technologies.includes(record.technology)) {
				technologiesToDelete.push(record.id);
			}
		});

		const currentTechnologyIDs = currentTechnologies.map((record) => {
			return record.technology;
		});

		tags.technologies.forEach((tag) => {
			if (!currentTechnologyIDs.includes(tag)) {
				technologiesToCreate.push(tag);
			}
		});

		if (technologiesToDelete.length > 0) {
			const deleteTechnologyPromises = Promise.all(
				technologiesToDelete.map((record) => {
					return locals.pb
						.collection('projects_technologies')
						.delete(record, { $autoCancel: false });
				})
			);
			await deleteTechnologyPromises;
		}

		if (technologiesToCreate.length > 0) {
			const createTechnologyPromises = Promise.all(
				technologiesToCreate.map((technologyId) => {
					return locals.pb
						.collection('projects_technologies')
						.create({ project: projectId, technology: technologyId }, { $autoCancel: false });
				})
			);
			await createTechnologyPromises;
		}
	} catch (err) {
		console.log('Error:', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}

	throw redirect(303, redirectTo);
};

export const updateProjectVote = async (locals: App.Locals, projectId: string) => {
	try {
		const existingVote = await locals.pb.collection('project_votes').getFullList<ProjectVote>(1, {
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
