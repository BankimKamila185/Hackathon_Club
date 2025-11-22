import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import * as eventService from '../services/eventService';
import { uploadEventPoster } from '../services/uploadService';

const CreateEventForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
        type: 'Team',
        image: ''
    });
    const [preview, setPreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setError('Image size must be less than 10MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }

            setError('');
            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let imageUrl = '';

            // Upload image if selected
            if (imageFile) {
                const { data } = await uploadEventPoster(imageFile);
                imageUrl = data.posterUrl;
            }

            // Create event with image URL
            await eventService.createEvent({
                ...formData,
                image: imageUrl,
                status: 'Upcoming'
            });

            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Create New Event</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors" disabled={loading}>
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. HackTheFuture 2025"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                value={formData.date}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select
                                name="type"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                value={formData.type}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="Team">Team</option>
                                <option value="Individual">Individual</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            rows="3"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                            placeholder="Brief description of the event..."
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Event Image</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={loading}
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                    <Upload className="w-8 h-8 text-slate-400" />
                                    <span className="text-sm">Click to upload image</span>
                                    <span className="text-xs text-slate-400">Max size: 10MB</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Event...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventForm;
