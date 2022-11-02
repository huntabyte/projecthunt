// This file was @generated using pocketbase-typegen

export type IsoDateString = string

export type RecordIdString = string

export type UserIdString = string

export type BaseRecord = {
    id: RecordIdString
    created: IsoDateString
    updated: IsoDateString
    "@collectionId": string
    "@collectionName": string
}

export enum Collections {
	Comments = "comments",
	Projects = "projects",
	Users = "users",
	Votes = "votes",
}

export type CommentsRecord = {
	content: string
	user: RecordIdString
	project: RecordIdString
}

export type ProjectsRecord = {
	name: string
	tagline: string
	url: string
	description: string
	user: RecordIdString
	thumbnail?: string
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

export type VotesRecord = {
	user: RecordIdString
	project: RecordIdString
}

export type CollectionRecords = {
	comments: CommentsRecord
	projects: ProjectsRecord
	users: UsersRecord
	votes: VotesRecord
}