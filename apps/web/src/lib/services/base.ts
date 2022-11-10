import { error, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';

export const deleteRecord = async (
	locals: App.Locals,
	collectionName: string,
	recordId: string,
	redirectTo: string
) => {
	try {
		await locals.pb.collection(collectionName).delete(recordId as string);
	} catch (err) {
		console.log('Error:', err);
		const e = err as ClientResponseError;
		throw error(e.status, e.data.message);
	}
	throw redirect(303, redirectTo);
};
