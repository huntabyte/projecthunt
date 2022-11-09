import type PocketBase from 'pocketbase';

export const usernameExists = async (pb: PocketBase, username: string) => {
	try {
		const user = await pb.collection('users').getFullList(undefined, {
			filter: `username = "${username}"`
		});
		if (user.length === 0) {
			return false;
		} else {
			return true;
		}
	} catch (err) {
		console.log('Error: ', err);
		return true;
	}
};
