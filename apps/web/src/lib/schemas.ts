import { zfd } from 'zod-form-data';
import { z } from 'zod';

export const createProjectDto = z.object({
	name: z.string().min(1).max(40).trim(),
	tagline: z.string().min(1).max(60).trim(),
	url: z.string().url(),
	description: z.string().min(1).max(240).trim(),
	thumbnail: z.instanceof(Blob).optional(),
	user: z.string().optional()
});

export const createCommentDto = z.object({
	content: z.string().min(2).max(240).trim(),
	project: z.string(),
	user: z.string()
});

export const updateCommentDto = createCommentDto.extend({
	id: z.string()
});

export const loginUserDto = zfd.formData({
	email: z.string().email(),
	password: z.string()
});

export const registerUserDto = zfd.formData({
	name: z.string().min(2).max(64).trim(),
	email: z.string().email(),
	password: z.string().min(6).max(64),
	passwordConfirm: z.string().min(6).max(64)
});

export type registerUserErrors = z.inferFlattenedErrors<typeof registerUserDto>;
