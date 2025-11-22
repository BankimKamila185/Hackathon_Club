import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Helper function to upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = 'hackathon-club') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: 'auto', // Automatically detect file type
            transformation: [
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            resourceType: result.resource_type
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload file to Cloudinary');
    }
};

// Helper function to delete file from Cloudinary
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete file from Cloudinary');
    }
};

export default cloudinary;
