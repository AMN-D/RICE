/**
 * ImgBB Image Upload Service
 * Uploads images to ImgBB and returns URLs
 */

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export interface ImgBBResponse {
    data: {
        id: string;
        title: string;
        url_viewer: string;
        url: string;
        display_url: string;
        width: string;
        height: string;
        size: string;
        time: string;
        expiration: string;
        image: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        thumb: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        medium?: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        delete_url: string;
    };
    success: boolean;
    status: number;
}

export interface UploadResult {
    url: string;
    thumbnailUrl: string;
    displayUrl: string;
    deleteUrl: string;
}

/**
 * Convert a File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data:image/xxx;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Upload an image file to ImgBB
 * @param file - The image file to upload
 * @param name - Optional custom name for the image
 * @returns Upload result with URLs
 */
export const uploadImage = async (file: File, name?: string): Promise<UploadResult> => {
    if (!IMGBB_API_KEY) {
        throw new Error('ImgBB API key is not configured. Add VITE_IMGBB_API_KEY to your .env file.');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
    }

    // Validate file size (max 32MB)
    const maxSize = 32 * 1024 * 1024; // 32MB
    if (file.size > maxSize) {
        throw new Error('File size must be less than 32MB');
    }

    const base64Image = await fileToBase64(file);

    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Image);
    if (name) {
        formData.append('name', name);
    }

    const response = await fetch(IMGBB_UPLOAD_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
    }

    const data: ImgBBResponse = await response.json();

    if (!data.success) {
        throw new Error('Image upload failed');
    }

    return {
        url: data.data.image.url,
        thumbnailUrl: data.data.thumb.url,
        displayUrl: data.data.display_url,
        deleteUrl: data.data.delete_url,
    };
};

export const imageUploadService = {
    uploadImage,
};
