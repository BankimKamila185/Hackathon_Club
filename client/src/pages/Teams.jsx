import React, { useState, useEffect } from 'react';
import { Users, UserPlus, X, Upload } from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { fetchTeams } from '../services/teamService';
import { uploadTeamLogo } from '../services/uploadService';

const Teams = () => {
    const { myTeams, createTeam, joinTeam, events, user } = useEvent();
    const [allTeams, setAllTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        eventId: '',
        logo: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const { data } = await fetchTeams();
            setAllTeams(data.data || []);
        } catch (error) {
            console.error('Failed to fetch teams', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('Logo size must be less than 10MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }

            setError('');
            setLogoFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            let logoUrl = '';

            // Upload logo if selected
            if (logoFile) {
                const { data } = await uploadTeamLogo(logoFile);
                logoUrl = data.logoUrl;
            }

            await createTeam({
                ...formData,
                logo: logoUrl
            });

            // Reset form and close modal
            setFormData({ name: '', description: '', eventId: '', logo: '' });
            setLogoFile(null);
            setLogoPreview('');
            setShowCreateModal(false);

            // Reload teams
            await loadTeams();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to create team');
        } finally {
            setSubmitting(false);
        }
    };

    const handleJoinTeam = async (teamId) => {
        try {
            await joinTeam(teamId);
            await loadTeams();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to join team');
        }
    };

    const isInTeam = (teamId) => {
        return myTeams.some(team => team._id === teamId);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Teams</h1>
                    <p className="text-slate-500">Find teammates or manage your squad.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" /> Create Team
                </button>
            </div>

            {/* My Teams Section */}
            {myTeams.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">My Teams</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myTeams.map(team => (
                            <div key={team._id} className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    {team.logo ? (
                                        <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                            {team.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900">{team.name}</h3>
                                        <p className="text-sm text-slate-600">{team.members?.length || 0} members</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{team.description}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="px-2 py-1 bg-white rounded-full">
                                        {events.find(e => e._id === team.event)?.title || 'Event'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Teams Section */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">All Teams</h2>
                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading teams...</div>
                ) : allTeams.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No teams found</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            It looks like no teams have been formed yet. Be the first to create a team!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allTeams.map(team => (
                            <div key={team._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4 mb-4">
                                    {team.logo ? (
                                        <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold text-xl">
                                            {team.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900">{team.name}</h3>
                                        <p className="text-sm text-slate-600">{team.members?.length || 0} members</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 mb-4">{team.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded-full">
                                        {events.find(e => e._id === team.event)?.title || 'Event'}
                                    </span>
                                    {!isInTeam(team._id) && (
                                        <button
                                            onClick={() => handleJoinTeam(team._id)}
                                            className="text-blue-600 font-semibold text-sm hover:text-blue-700"
                                        >
                                            Join Team
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Create New Team</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                disabled={submitting}
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Team Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Code Warriors"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Event</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={formData.eventId}
                                    onChange={e => setFormData({ ...formData, eventId: e.target.value })}
                                    disabled={submitting}
                                >
                                    <option value="">Select an event</option>
                                    {events.map(event => (
                                        <option key={event._id} value={event._id}>{event.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Brief description of your team..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    disabled={submitting}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Team Logo (Optional)</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={submitting}
                                    />
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg mx-auto" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Upload className="w-8 h-8 text-slate-400" />
                                            <span className="text-sm">Click to upload logo</span>
                                            <span className="text-xs text-slate-400">Max size: 10MB</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Creating Team...' : 'Create Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teams;
