import API from './api';

export const fetchEvents = () => API.get('/events');
export const getEventById = (id) => API.get(`/events/${id}`);
export const createEvent = (eventData) => API.post('/events', eventData);
export const deleteEvent = (id) => API.delete(`/events/${id}`);
