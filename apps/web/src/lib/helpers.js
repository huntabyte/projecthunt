const POCKETBASE_HOST = 'localhost:8090';

export const serializeNonPOJOs = (obj) => {
	return JSON.parse(JSON.stringify(obj));
};

export const getImageURL = (collection, recordId, fileName, size = '0x0') => {
	return `http://${POCKETBASE_HOST}/api/files/${collection}/${recordId}/${fileName}?thumb=${size}`;
};
