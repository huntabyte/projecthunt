<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import type { Project, ProjectVote } from '$lib/types';

	import { ProjectVoteButton } from '$lib/components';
	export let project: Project;
	let hasVoted = Boolean(
		project.expand?.['project_votes(project)'].find(
			(vote: ProjectVote) => vote.user === $page?.data?.user?.id
		)
	);
</script>

<form
	action="?/voteProject"
	method="POST"
	use:enhance={({ form }) => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				form.reset();
				hasVoted = !hasVoted;
			}
			if (result.type === 'invalid') {
				await applyAction(result);
			}
			update();
		};
	}}
>
	<input type="hidden" value={project.id} name="id" />

	<ProjectVoteButton {hasVoted} {project} />
</form>
