import React from 'react';
import SubmissionForm from '../components/SubmissionForm';
import { useParams } from 'react-router-dom';

const Submission = () => {
    const { id } = useParams();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Submit Project</h1>
            <SubmissionForm eventId={id} />
        </div>
    );
};

export default Submission;
