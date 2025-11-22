import React from 'react';
import AttendanceViewer from '../components/AttendanceViewer';
import { useParams } from 'react-router-dom';

const Attendance = () => {
    const { id } = useParams();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Attendance</h1>
            <AttendanceViewer eventId={id} />
        </div>
    );
};

export default Attendance;
