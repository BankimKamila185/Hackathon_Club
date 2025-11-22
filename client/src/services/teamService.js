import API from './api';

export const fetchTeams = () => API.get('/teams');
export const createTeam = (teamData) => API.post('/teams', teamData);
export const joinTeam = (teamId) => API.put(`/teams/${teamId}/join`);
export const getMyTeams = () => API.get('/teams/myteams');
