const POCKETBASE_HOST = 'localhost:8090';

export const serializeNonPOJOs = <T> (obj: T): T => {
	return structuredClone(obj)
};

export const getImageURL = (collection: string, recordId:string, fileName: string, size = '0x0') => {
	return `http://${POCKETBASE_HOST}/api/files/${collection}/${recordId}/${fileName}?thumb=${size}`;
};
