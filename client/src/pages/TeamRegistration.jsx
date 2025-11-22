import React from 'react';
import { useParams } from 'react-router-dom';

const TeamRegistration = () => {
    const { id } = useParams();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Team Registration</h1>
            <p>Registration for event {id}</p>
            {/* Add TeamRegistrationForm here later */}
        </div>
    );
};

export default TeamRegistration;
