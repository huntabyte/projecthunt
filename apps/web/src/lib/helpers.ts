import { error } from '@sveltejs/kit';
import type { z, ZodError } from 'zod'
import type { RegisterUserDto } from './types';

const POCKETBASE_HOST = 'localhost:8090';

export const serializeNonPOJOs = <T> (obj: T): T => {
	return structuredClone(obj)
};

export const getImageURL = (collection: string, recordId:string, fileName: string, size = '0x0') => {
	return `http://${POCKETBASE_HOST}/api/files/${collection}/${recordId}/${fileName}?thumb=${size}`;
};

export const validateData = async <T extends z.ZodTypeAny>( request: Request, schema: T ): Promise<{ formData: z.infer<T>, errors: z.inferFlattenedErrors<typeof schema> | null }> => {
  const body = Object.fromEntries(await request.formData()) 

  try { 
    const formData = schema.parse(body)
    return {
      formData,
      errors: null
    }
  } catch (err) {
    console.log('Error:', err)
    const errors = (err as ZodError).flatten()
    return {
      formData: body,
      errors
    }
  }

}