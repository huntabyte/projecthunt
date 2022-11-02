import { zfd } from 'zod-form-data'
import { string, z } from 'zod'

export const projectDto = zfd.formData({
	name: z.string().min(1).max(40).trim(),
	tagline: z.string().min(1).max(60).trim(),
	url: z.string().url(),
	description: z.string().min(1).max(240).trim(),
	thumbnail: z.any(),
  user: z.string().optional()
});

export const createCommentDto = zfd.formData({
	content: z.string().min(2).max(240).trim()
})

export const updateCommentDto = zfd.formData({
	id: z.string().optional(),
	content: z.string().min(2).max(240).trim()
});

export const loginUserDto = zfd.formData({
  email: z.string().email(),
  password: z.string()
})

export const registerUserDto = zfd.formData({
  name: z.string().min(2).max(64).trim(),
  email: z.string().email(),
  password: z.string().min(6).max(64),
  passwordConfirm: z.string().min(6).max(64),
})