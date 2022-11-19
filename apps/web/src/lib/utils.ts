import type { z, ZodError } from 'zod';
import { z as ZOD } from 'zod';
import { zfd } from 'zod-form-data';
import { differenceInDays, formatDistanceToNowStrict } from 'date-fns';
import { updateProjectImagesDto } from './schemas';
import { PUBLIC_PB_HOST } from '$env/static/public';

const { randomBytes } = await import('node:crypto');

export const serializeNonPOJOs = <T>(obj: T): T => {
	return structuredClone(obj);
};

export const getImageURL = (
	collection: string,
	recordId: string,
	fileName: string | undefined,
	size = '0x0'
) => {
	return `http://${PUBLIC_PB_HOST}/api/files/${collection}/${recordId}/${fileName}?thumb=${size}`;
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

interface SafeParseImages {
	success: boolean;
	error?: ZodError;
	data?: {
		images: Blob[];
	};
}

export const validateFormData = async <T extends z.ZodTypeAny>(
	formData: FormData,
	schema: T
): Promise<{ formData: FormData; errors: z.inferFlattenedErrors<typeof schema> | null }> => {
	const body = zfd
		.formData({
			images: zfd.repeatableOfType(ZOD.instanceof(Blob))
		})
		.safeParse(formData) as SafeParseImages;

	let images = body?.data?.images;

	const parsedImages = updateProjectImagesDto.safeParse({
		images: body?.data?.images
	}) as SafeParseImages;

	if (!parsedImages.success) {
		const badIndexes = parsedImages.error?.issues.map((issue) => {
			return issue.path[1];
		});

		if (badIndexes) {
			for (let i = badIndexes.length - 1; i >= 0; i--) {
				images?.splice(badIndexes[i] as number, 1);
			}
		}
	}

	const imageFormData = new FormData();
	images?.forEach((image) => {
		imageFormData.append('images', image);
	});

	return {
		formData: imageFormData,
		errors: parsedImages.error?.flatten() ?? null
	};
};

export const generateUsername = (name: string): string => {
	const id = randomBytes(2).toString('hex');
	return `${name.slice(0, 5)}${id}`;
};

export const generateRelativeDate = (date: Date) => {
	const options = {
		month: 'short',
		day: 'numeric'
	};

	if (differenceInDays(new Date(), date) >= 1) {
		return date.toLocaleString('en-US', options as Intl.DateTimeFormatOptions);
	}

	return formatDistanceToNowStrict(date, { addSuffix: true });
};
