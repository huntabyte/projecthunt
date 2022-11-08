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

export const registerUserDto = zfd
	.formData({
		name: z
			.string({ required_error: 'Name is required.' })
			.min(2, { message: 'Name must be at least 2 characters' })
			.max(64, { message: 'Name must be less than 64 characters' })
			.trim(),
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Email must be a valid email.' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(64, { message: 'Password must be less than 64 characters' }),
		passwordConfirm: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(64, { message: 'Password must be less than 64 characters' })
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['passwordConfirm']
			});
		}
	});

export type registerUserErrors = z.inferFlattenedErrors<typeof registerUserDto>;
