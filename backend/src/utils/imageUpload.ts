import cloudinary from '../config/cloudinary';

export interface UploadOptions {
    folder?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
}

export const uploadAsset = async (
    fileStr: string,
    { folder = 'peaktech', resourceType = 'auto' }: UploadOptions = {}
) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder,
            resource_type: resourceType,
        });
        return uploadResponse; // full Cloudinary response (url, public_id, resource_type, etc.)
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload asset');
    }
};
