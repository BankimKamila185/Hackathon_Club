import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Users, Clock, Share2, Award, LayoutGrid, FileText } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { getEventById } from '../services/eventService';
import SubmissionForm from '../components/SubmissionForm';
import SubmissionViewer from '../components/SubmissionViewer';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, joinEvent } = useEvent();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showSubmissionForm, setShowSubmissionForm] = useState(false);
    const [showSubmissionViewer, setShowSubmissionViewer] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const { data } = await getEventById(id);
            setEvent(data);
        } catch (error) {
            console.error('Failed to fetch event', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/events/${id}` } });
            return;
        }
        try {
            await joinEvent(id);
            fetchEvent(); // Refresh to show registered state
        } catch (error) {
            console.error('Registration failed', error);
            alert('Failed to register for event');
        }
    };

    const isRegistered = event?.participants?.some(p => p._id === user?._id || p === user?._id);
    const isEnded = event?.endDate && new Date() > new Date(event.endDate);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-slate-500">Loading event details...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-slate-500">Event not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 text-sm text-blue-600 font-bold mb-4">
                                <span className="bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider text-xs">
                                    {event.type || 'Hackathon'}
                                </span>
                                {isEnded && <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs">Ended</span>}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-slate-600 mb-8">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-slate-400" />
                                    <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                    <span>{event.location || 'Online'}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {!isRegistered ? (
                                    <button
                                        onClick={handleRegister}
                                        disabled={isEnded}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                                    >
                                        {isEnded ? 'Event Ended' : 'Register Now'}
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button className="bg-green-50 text-green-700 px-6 py-3 rounded-xl font-bold border border-green-100 flex items-center gap-2 cursor-default">
                                            <Users className="w-5 h-5" /> Registered
                                        </button>
                                        <button
                                            onClick={() => setShowSubmissionForm(true)}
                                            disabled={isEnded}
                                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                                        >
                                            <FileText className="w-5 h-5" /> Submit Project
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* QR Code Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center w-full md:w-auto">
                            <div className="bg-white p-2 rounded-xl border border-slate-100 mb-4">
                                <QRCodeSVG value={window.location.href} size={150} />
                            </div>
                            <p className="text-sm font-medium text-slate-900 mb-1">Scan to Share</p>
                            <p className="text-xs text-slate-500">Check-in at venue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex gap-6 border-b border-slate-200 mb-8">
                    {['overview', 'teams', 'submissions'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold capitalize transition-colors relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">About Event</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </section>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" /> Participants
                                </h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-3xl font-bold text-slate-900">{event.participants?.length || 0}</div>
                                    <div className="text-sm text-slate-500">Registered<br />Hackers</div>
                                </div>
                                <div className="flex -space-x-2 overflow-hidden">
                                    {event.participants?.slice(0, 5).map((p, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                                            {p.name?.[0] || '?'}
                                        </div>
                                    ))}
                                    {event.participants?.length > 5 && (
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                                            +{event.participants.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'teams' && (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Teams</h3>
                        <p className="text-slate-500">Team formation and viewing coming soon.</p>
                        <button onClick={() => navigate('/teams')} className="mt-4 text-blue-600 font-bold hover:underline">
                            Go to Teams Page
                        </button>
                    </div>
                )}

                {activeTab === 'submissions' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Project Submissions</h3>
                            <button
                                onClick={() => setShowSubmissionViewer(true)}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                View All Submissions
                            </button>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-8 text-center">
                            <Award className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-blue-900 mb-2">Showcase Your Work</h3>
                            <p className="text-blue-700 mb-6 max-w-md mx-auto">
                                Submit your project to be eligible for prizes and feedback from judges.
                            </p>
                            <button
                                onClick={() => setShowSubmissionForm(true)}
                                disabled={isEnded}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                Submit Project
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showSubmissionForm && (
                <SubmissionForm
                    eventId={id}
                    teamId={user?.team} // Assuming user has a team field or we fetch it
                    onClose={() => setShowSubmissionForm(false)}
                />
            )}

            {showSubmissionViewer && (
                <SubmissionViewer
                    eventId={id}
                    onClose={() => setShowSubmissionViewer(false)}
                />
            )}
        </div>
    );
};

export default EventDetails;
