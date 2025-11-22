import API from './api';

export const markAttendance = (attendanceData) => API.post('/attendance', attendanceData);
export const getEventAttendance = (eventId) => API.get(`/attendance/${eventId}`);
export const exportAttendance = (eventId) => API.get(`/attendance/${eventId}/export`, { responseType: 'blob' });
