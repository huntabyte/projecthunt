import type { Record } from 'pocketbase';
import type { z } from 'zod';
import {
	projectDto,
	updateCommentDto,
	createCommentDto,
	resetPasswordDto,
	createProjectDto
} from '$lib/schemas';
import { registerUserDto, loginUserDto } from './schemas';

interface User extends Record {
	id: string;
	name: string;
	avatar?: string;
}

interface Project extends Record {
	name: string;
	tagline: string;
	thumbnail?: string | undefined;
	description: string;
	expand: {
		'votes(project)': Vote[];
	};
	user: string;
}

interface Vote extends Record {
	user: string;
	project: string;
}

interface Comment extends Record {
	user: string;
	project: string;
	content: string;
	expand: {
		user: User;
	};
}

type ProjectDto = z.infer<projectDto>;
type UpdateCommentDto = z.infer<updateCommentDto>;
type CreateCommentDto = z.infer<createCommentDto>;
type RegisterUserDto = z.infer<registerUserDto>;
type LoginUserDto = z.infer<loginUserDto>;
type ResetPasswordDto = z.infer<resetPasswordDto>;

interface CommentActionData {
	data?: CreateCommentDto;
	errors?: z.inferFlattenedErrors<typeof createCommentDto>['fieldErrors'];
	updateData?: UpdateCommentDto;
	updateErrors?: z.inferFlattenedErrors<typeof updateCommentDto>['fieldErrors'];
	success?: boolean;
}

interface LoginActionData {
	data?: LoginUserDto;
	errors?: z.inferFlattenedErrors<typeof registerUserDto>['fieldErrors'];
	notVerified?: boolean;
	invalidCredentials?: boolean;
}

interface ResetPasswordActionData {
	data?: ResetPasswordDto;
	errors?: z.inferFlattenedErrors<typeof resetPasswordDto>['fieldErrors'];
	success?: boolean;
}

interface UpdateProjectActionData {
	data?: CreateProjectDto;
	errors?: z.inferFlattenedErrors<typeof createProjectDto>['fieldErrors'];
	success?: boolean;
}

interface NavigationItem {
	title: string;
	href: string;
}
