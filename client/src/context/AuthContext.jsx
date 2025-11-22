import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch user role from MongoDB backend
                await fetchUserRole();
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const fetchUserRole = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const { data } = await api.get('/auth/me');
                setUserRole(data.role);
            } else {
                setUserRole('user');
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            setUserRole('user');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        return signOut(auth);
    };

    const value = {
        currentUser,
        userRole,
        loading,
        logout,
        fetchUserRole
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
