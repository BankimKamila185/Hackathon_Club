import React, { useState } from 'react';
import { useEvent } from '../context/EventContext';
import { Plus, Trash2, Edit2, Calendar, FileText, UserCheck } from 'lucide-react';
import CreateEventForm from '../components/CreateEventForm';
import SubmissionViewer from '../components/SubmissionViewer';
import AttendanceViewer from '../components/AttendanceViewer';

const AdminPanel = () => {
    const { events, deleteEvent } = useEvent();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewSubmission, setViewSubmission] = useState(null);
    const [viewAttendance, setViewAttendance] = useState(null);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500">Manage events and view platform statistics.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-blue-500/30"
                >
                    <Plus className="w-5 h-5" /> Create Event
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">All Events</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Event Name</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {events.map((event) => (
                                <tr key={event._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={event.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                            <span className="font-medium text-slate-900">{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {event.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{event.type}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewSubmission(event._id)}
                                                className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                                                title="View Submissions"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewAttendance(event._id)}
                                                className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                                                title="View Attendance"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteEvent(event._id)}
                                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && <CreateEventForm onClose={() => setIsModalOpen(false)} />}
            {viewSubmission && <SubmissionViewer eventId={viewSubmission} onClose={() => setViewSubmission(null)} />}
            {viewAttendance && <AttendanceViewer eventId={viewAttendance} onClose={() => setViewAttendance(null)} />}
        </div>
    );
};

export default AdminPanel;
