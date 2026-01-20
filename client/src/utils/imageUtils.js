import { API_URL } from '../config';

/**
 * Resolves the full image URL.
 * If the path is already a full URL (starting with http), it returns it as is (Cloudinary).
 * If the path is relative, it prepends the backend base URL (Localhost fallback).
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;

    // Remove '/api' from API_URL to get the BASE_URL (e.g. http://localhost:5001)
    const baseUrl = API_URL.endsWith('/api')
        ? API_URL.slice(0, -4)
        : API_URL;

    // Ensure imagePath starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${baseUrl}${cleanPath}`;
};
