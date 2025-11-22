import React from 'react';
import { useEvent } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { ArrowRight, Trophy, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const Overview = () => {
    const { events } = useEvent();
    const upcomingEvents = events.slice(0, 3);

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome back, Hacker! 🚀</h1>
                    <p className="text-blue-100 text-lg mb-8">
                        Ready to build something amazing? Check out the upcoming hackathons and start your journey.
                    </p>
                    <Link
                        to="/upcoming"
                        className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                    >
                        Explore Hackathons <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-40 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={Zap} label="Active Events" value={events.length} color="bg-amber-500" />
                <StatCard icon={Users} label="Total Participants" value="1,234" color="bg-blue-500" />
                <StatCard icon={Trophy} label="Projects Submitted" value="89" color="bg-purple-500" />
            </div>

            {/* Featured Events */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Featured Hackathons</h2>
                    <Link to="/upcoming" className="text-blue-600 text-sm font-medium hover:text-blue-700">View all</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overview;
