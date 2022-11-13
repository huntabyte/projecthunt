import type { Record } from 'pocketbase';
import type { z } from 'zod';
import {
	projectDto,
	updateCommentDto,
	createCommentDto,
	resetPasswordDto,
	createProjectDto,
	registerUserDto,
	loginUserDto,
	updateEmailDto,
	updateReplyDto
} from '$lib/schemas';
import { updateUsernameDto } from '$lib/schemas';
import { createReplyDto } from './schemas';

interface User extends Record {
	id: string;
	name: string;
	avatar?: string;
	username: string;
}

interface Project extends Record {
	name: string;
	tagline: string;
	thumbnail?: string | undefined;
	description: string;
	expand: {
		'project_votes(project)': ProjectVote[];
	};
	user: string;
}

interface ProjectVote extends Record {
	user: string;
	project: string;
}

interface CommentVote extends Record {
	user: string;
	comment: string;
}

interface Comment extends Record {
	user: string;
	project: string;
	content: string;
	expand: {
		user: User;
		'comment_replies(comment)': CommentReply[] | undefined[];
		'comment_votes(comment)': CommentVote[] | undefined[];
		reply?: Comment;
	};
}

interface CommentReply extends Record {
	comment: string;
	reply: string;
	expand: {
		reply: Comment;
	};
}

type ProjectDto = z.infer<projectDto>;
type UpdateCommentDto = z.infer<updateCommentDto>;
type CreateCommentDto = z.infer<createCommentDto>;
type RegisterUserDto = z.infer<registerUserDto>;
type LoginUserDto = z.infer<loginUserDto>;
type ResetPasswordDto = z.infer<resetPasswordDto>;
type UpdateEmailDto = z.infer<updateEmailDto>;
type UpdateUsernameDto = z.infer<updateUsernameDto>;
type CreateReplyDto = z.infer<createReplyDto>;
type UpdateReplyDto = z.infer<updateReplyDto>;

interface CommentActionData {
	data?: CreateCommentDto;
	errors?: z.inferFlattenedErrors<typeof createCommentDto>['fieldErrors'];
	updateData?: UpdateCommentDto;
	updateErrors?: z.inferFlattenedErrors<typeof updateCommentDto>['fieldErrors'];
	success?: boolean;
}

interface ReplyActionData {
	data?: CreateReplyDto;
	errors?: z.inferFlattenedErrors<typeof createReplyDto>['fieldErrors'];
	updateData?: UpdateReplyDto;
	updateErrors?: z.inferFlattenedErrors<typeof updateReplyDto>['fieldErrors'];
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

type UpdateEmailErrors = z.inferFlattenedErrors<typeof updateEmailDto>['fieldErrors'];
type UpdateUsernameErrors = z.inferFlattenedErrors<typeof updateUsernameDto>['fieldErrors'];

interface UpdateAccountActionData {
	data?: UpdateEmailDto | UpdateUsernameDto;
	errors?: {
		emailErrors?: UpdateEmailErrors;
		usernameErrors?: UpdateUsernameErrors;
	};
	success?: boolean;
}

interface NavigationItem {
	title: string;
	href: string;
}
