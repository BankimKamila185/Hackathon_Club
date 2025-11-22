import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { userRole } = useAuth();
    const canCreateEvent = ['lead', 'co-lead', 'admin'].includes(userRole);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Welcome to Hackathon Platform</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {canCreateEvent && (
                    <Link to="/create-event" className="p-4 bg-blue-100 rounded hover:bg-blue-200">
                        <h2 className="text-xl font-semibold">Create Event</h2>
                        <p>Leads and Co-leads only</p>
                    </Link>
                )}
                <div className="p-4 bg-green-100 rounded">
                    <h2 className="text-xl font-semibold">Your Events</h2>
                    <p>View events you are participating in</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
