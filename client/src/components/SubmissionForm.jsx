import React, { useState, useEffect } from 'react';
const SubmissionForm = ({ eventId, teamId, onClose, initialData = null }) => {
    const [formData, setFormData] = useState({
        projectTitle: '',
        description: '',
        repoLink: '',
        demoLink: '',
        attachments: []
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                projectTitle: initialData.projectTitle || '',
                description: initialData.description || '',
                repoLink: initialData.repoLink || '',
                demoLink: initialData.demoLink || '',
                attachments: initialData.attachments || []
            });
        }
    }, [initialData]);

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        setError('');

        try {
            const uploadPromises = files.map(file => uploadSubmissionFile(file));
            const results = await Promise.all(uploadPromises);

            const newAttachments = results.map((res, index) => ({
                name: files[index].name,
                url: res.data.fileUrl,
                type: res.data.format
            }));

            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, ...newAttachments]
            }));
        } catch (err) {
            setError('Failed to upload files. Please try again.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (initialData) {
                await updateSubmission(initialData._id, formData);
            } else {
                await createSubmission({
                    eventId,
                    teamId,
                    ...formData
                });
            }

            onClose();
            // TODO: Replace alert with toast notification
            alert(initialData ? 'Project updated successfully!' : 'Project submitted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    disabled={loading}
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Submission' : 'Submit Project'}</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.projectTitle}
                                    onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Repository Link</label>
                                <div className="relative">
                                    <Github className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://github.com/..."
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.repoLink}
                                        onChange={e => setFormData({ ...formData, repoLink: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Demo Link (Optional)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.demoLink}
                                        onChange={e => setFormData({ ...formData, demoLink: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="8"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Attachments (Screenshots, Slides, etc.)</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={loading || uploading}
                            />
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                                <Upload className="w-8 h-8" />
                                <span className="text-sm">Click or drag files to upload</span>
                            </div>
                        </div>

                        {uploading && <div className="text-sm text-blue-600 mt-2 text-center">Uploading files...</div>}

                        {formData.attachments.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                                {formData.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 relative group">
                                        {['jpg', 'jpeg', 'png', 'gif'].includes(file.type) ? (
                                            <ImageIcon className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <FileText className="w-4 h-4 text-slate-500" />
                                        )}
                                        <span className="text-xs truncate flex-1">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><Send className="w-4 h-4" /> {initialData ? 'Update Submission' : 'Submit Project'}</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubmissionForm;
