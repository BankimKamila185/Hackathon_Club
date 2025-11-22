import API from './api';

export const createSubmission = (submissionData) => API.post('/submissions', submissionData);
export const updateSubmission = (id, submissionData) => API.put(`/submissions/${id}`, submissionData);
export const getSubmissionsByEvent = (eventId) => API.get(`/submissions/event/${eventId}`);
export const gradeSubmission = (submissionId, gradeData) => API.post(`/submissions/${submissionId}/grade`, gradeData);
