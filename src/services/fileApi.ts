// Create fileUploadApi.ts
import { api } from './http';

export const uploadFileApi = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', file.entityType);
    formData.append('entityId', file.entityId || '');
    formData.append('isPublic', 'true');

    const res = await api.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const getFileUrlApi = (fileName) => {
    return `/api/files/serve/${fileName}`;
};

export const serveFileApi = async (fileName) => {
    const res = await api.get(`/files/serve/${fileName}`, {
        responseType: 'blob'
    });
    return res;
};

export const downloadFileApi = async (fileName, downloadName = null) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error('downloadFileApi can only be called in browser environment');
    }

    const response = await serveFileApi(fileName);
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName || fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const deleteFileApi = async (id) => {
    const res = await api.delete(`/files/${id}`);
    return res.data;
};

export const deleteFileByPathApi = async (path) => {
    const res = await api.delete(`/files/path/${path}`);
    return res.data;
};

export const deleteFileByNameApi = async (name) => {
    const res = await api.delete(`/files/${name}`);
    return res.data;
};

export const getAllFilesApi = async () => {
    const res = await api.get('/files');
    return res.data;
};

export const getFileByIdApi = async (id) => {
    const res = await api.get(`/files/${id}`);
    return res.data;
};

export const getFileByPathApi = async (path) => {
    const res = await api.get(`/files/path/${path}`);
    return res.data;
};

export const getFilePreviewUrl = (fileName) => {
    // If it's a public path (starts with /), return as-is
    if (fileName?.startsWith('/')) {
        return fileName;
    }
    // Otherwise, it's a storage file
    return `api/files/serve/${fileName}`;
};


export const hasFiles = (data: any): boolean => {
    for (const key in data) {
        if (data[key] instanceof File || data[key] instanceof Blob) {
            return true;
        }
    }
    return false;
};

export const smartApiCall = async (method: string, endpoint: string, data: any) => {
    if (hasFiles(data)) {
        const formData = new FormData();
        for (const key in data) {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        }

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };

        if (method === 'POST') {
            return await api.post(endpoint, formData, config);
        } else if (method === 'PUT') {
            return await api.put(endpoint, formData, config);
        }
    } 
    else {
        if (method === 'POST') {
            return await api.post(endpoint, data);
        } else if (method === 'PUT') {
            return await api.put(endpoint, data);
        }
    }
};