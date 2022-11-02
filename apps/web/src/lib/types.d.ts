import type { Record,  } from "pocketbase";
import type { z } from "zod";
import { projectDto, updateCommentDto, createCommentDto } from '$lib/schemas';
import { registerUserDto, loginUserDto } from './schemas';


interface User extends Record {
  id: string,
  name: string,
  avatar?: string,
}

interface Project extends Record {
  name: string,
  tagline: string,
  thumbnail?: string,
  description: string,
  extends: {
    'votes(project)': Vote[]
  }
  user: string
}


interface Vote extends Record {
  user: string,
  project: string
}

interface Comment extends Record {
  user: string,
  project: string
}

type ProjectDto = z.infer<projectDto>
type UpdateCommentDto = z.infer<updateCommentDto>
type CreateCommentDto = z.infer<createCommentDto>
type RegisterUserDto = z.infer<registerUserDto>
type LoginUserDto = z.infer<loginUserDto>