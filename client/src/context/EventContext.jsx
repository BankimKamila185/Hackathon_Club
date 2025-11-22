import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import * as eventService from '../services/eventService';
import * as teamService from '../services/teamService';

const EventContext = createContext();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [myTeams, setMyTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await authService.getMe();
                    setUser(data);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Fetch my teams when user is set
    useEffect(() => {
        if (user) {
            loadMyTeams();
        } else {
            setMyTeams([]);
        }
    }, [user]);

    const loadMyTeams = async () => {
        try {
            const { data } = await teamService.getMyTeams();
            setMyTeams(data.data || []);
        } catch (error) {
            console.error('Failed to fetch my teams', error);
        }
    };

    // Fetch events on mount
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const { data } = await eventService.fetchEvents();
                setEvents(data.data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            }
        };
        loadEvents();
    }, []);

    const login = async (credentials) => {
        const { data } = await authService.login(credentials);
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const register = async (userData) => {
        const { data } = await authService.register(userData);
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const addEvent = async (eventData) => {
        try {
            const { data } = await eventService.createEvent(eventData);
            setEvents([...events, data.data]);
        } catch (error) {
            console.error('Failed to create event', error);
            throw error;
        }
    };

    const deleteEvent = async (id) => {
        try {
            await eventService.deleteEvent(id);
            setEvents(events.filter(e => e._id !== id));
        } catch (error) {
            console.error('Failed to delete event', error);
            throw error;
        }
    };

    const createTeam = async (teamData) => {
        try {
            const { data } = await teamService.createTeam(teamData);
            await loadMyTeams(); // Refresh teams list
            return data;
        } catch (error) {
            console.error('Failed to create team', error);
            throw error;
        }
    };

    const joinTeam = async (teamId) => {
        try {
            const { data } = await teamService.joinTeam(teamId);
            await loadMyTeams(); // Refresh teams list
            return data;
        } catch (error) {
            console.error('Failed to join team', error);
            throw error;
        }
    };

    const refreshTeams = async () => {
        await loadMyTeams();
    };

    return (
        <EventContext.Provider value={{
            events,
            user,
            myTeams,
            loading,
            login,
            register,
            logout,
            addEvent,
            deleteEvent,
            createTeam,
            joinTeam,
            refreshTeams,
            userRole: user?.role || 'guest' // Derived role
        }}>
            {children}
        </EventContext.Provider>
    );
};
