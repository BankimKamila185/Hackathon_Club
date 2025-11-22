import React, { useState, useEffect } from 'react';
import { Check, X, UserCheck, Download, Plus } from 'lucide-react';
import { getEventAttendance, markAttendance, exportAttendance } from '../services/attendanceService';

const AttendanceViewer = ({ eventId, onClose }) => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMarkModal, setShowMarkModal] = useState(false);
    const [manualUserId, setManualUserId] = useState('');
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        fetchAttendance();
    }, [eventId]);

    const fetchAttendance = async () => {
        try {
            const { data } = await getEventAttendance(eventId);
            setAttendance(data.data || data || []);
        } catch (error) {
            console.error('Failed to fetch attendance', error);
            setError('Failed to load attendance data');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await exportAttendance(eventId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance-${eventId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed', error);
            alert('Failed to export attendance');
        }
    };

    const handleManualMark = async (e) => {
        e.preventDefault();
        setMarking(true);
        try {
            await markAttendance({
                eventId,
                userId: manualUserId,
                status: 'present'
            });
            setManualUserId('');
            setShowMarkModal(false);
            fetchAttendance();
            alert('Attendance marked successfully');
        } catch (error) {
            console.error('Failed to mark attendance', error);
            alert(error.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setMarking(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900">Attendance Record</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowMarkModal(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Mark
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                        >
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {showMarkModal && (
                    <div className="p-4 bg-blue-50 border-b border-blue-100">
                        <form onSubmit={handleManualMark} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter User ID"
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={manualUserId}
                                onChange={e => setManualUserId(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={marking}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {marking ? 'Marking...' : 'Mark'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowMarkModal(false)}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading attendance...</div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                                {error}
                            </div>
                        </div>
                    ) : attendance.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">No attendance marked yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {attendance.map(record => (
                                <div key={record._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <UserCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{record.user?.name || 'Unknown User'}</p>
                                            <p className="text-sm text-slate-500">{record.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold uppercase">
                                            {record.status}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(record.markedAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceViewer;
