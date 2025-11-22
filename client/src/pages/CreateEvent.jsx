import React from 'react';
import CreateEventForm from '../components/CreateEventForm';

const CreateEvent = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
            <CreateEventForm />
        </div>
    );
};

export default CreateEvent;
