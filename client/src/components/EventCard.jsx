import React, { useState } from 'react';
import { Calendar, Users, ArrowRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import SubmissionForm from './SubmissionForm';

const EventCard = ({ event }) => {
    const { user, myTeams } = useEvent();
    const [showSubmission, setShowSubmission] = useState(false);

    // Check if user has a team for this event
    const userTeam = myTeams.find(team => team.event?._id === event._id || team.event === event._id);
    const canSubmit = user && userTeam;
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600">
                    {event.status}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                    <span className="mx-1">•</span>
                    <Users className="w-4 h-4" />
                    <span>{event.type}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">{event.description}</p>

                <div className="flex items-center gap-3">
                    <Link
                        to={`/register/${event.id}`}
                        className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
                    >
                        Register Now <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {canSubmit && (
                        <button
                            onClick={() => setShowSubmission(true)}
                            className="inline-flex items-center text-green-600 font-semibold text-sm hover:text-green-700 transition-colors"
                        >
                            Submit Project <Send className="w-4 h-4 ml-1" />
                        </button>
                    )}
                </div>
            </div>

            {showSubmission && (
                <SubmissionForm
                    eventId={event._id}
                    teamId={userTeam._id}
                    onClose={() => setShowSubmission(false)}
                />
            )}
        </div>
    );
};

export default EventCard;
