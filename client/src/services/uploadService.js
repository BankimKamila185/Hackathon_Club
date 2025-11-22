import API from './api';

/**
 * Upload event poster to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise} Response with posterUrl and publicId
 */
export const uploadEventPoster = async (file) => {
    const formData = new FormData();
    formData.append('poster', file);

    return API.post('/upload/event-poster', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Upload team logo to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise} Response with logoUrl and publicId
 */
export const uploadTeamLogo = async (file) => {
    const formData = new FormData();
    formData.append('logo', file);

    return API.post('/upload/team-logo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Upload submission file to Cloudinary
 * @param {File} file - The file to upload
 * @returns {Promise} Response with fileUrl, publicId, and format
 */
export const uploadSubmissionFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return API.post('/upload/submission', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
