import React from 'react';
import { useEvent } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { Search, Filter } from 'lucide-react';

const Upcoming = () => {
    const { events } = useEvent();

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Upcoming Hackathons</h1>
                    <p className="text-slate-500">Discover and register for the latest tech events.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
                        />
                    </div>
                    <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
};

export default Upcoming;
