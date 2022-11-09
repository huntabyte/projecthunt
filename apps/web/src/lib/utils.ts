import type { z, ZodError } from 'zod';

const POCKETBASE_HOST = 'localhost:8090';

export const serializeNonPOJOs = <T>(obj: T): T => {
	return structuredClone(obj);
};

export const getImageURL = (
	collection: string,
	recordId: string,
	fileName: string | undefined,
	size = '0x0'
) => {
	return `http://${POCKETBASE_HOST}/api/files/${collection}/${recordId}/${fileName}?thumb=${size}`;
};

export const validateData = async <T extends z.ZodTypeAny>(
	formData: FormData,
	schema: T
): Promise<{ formData: z.infer<T>; errors: z.inferFlattenedErrors<typeof schema> | null }> => {
	const body = Object.fromEntries(formData);

	try {
		const formData = schema.parse(body);
		return {
			formData,
			errors: null
		};
	} catch (err) {
		console.log('Error:', err);
		const errors = (err as ZodError).flatten();
		return {
			formData: body,
			errors
		};
	}
};

export const generateUsername = (name: string): string => {
	const id = crypto.randomBytes(6).toString('hex');
	return `${name}${id}`;
};
