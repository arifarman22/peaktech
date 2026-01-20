import cloudinary from '../config/cloudinary';

export const uploadImage = async (fileStr: string, folder: string = 'peaktech') => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder: folder,
        });
        return uploadResponse.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
};
