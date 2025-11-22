import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Star, X, FileText } from 'lucide-react';
import { getSubmissionsByEvent, gradeSubmission } from '../services/submissionService';

const SubmissionViewer = ({ eventId, onClose }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [grading, setGrading] = useState(null); // Submission ID being graded
    const [gradeData, setGradeData] = useState({ score: '', feedback: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, [eventId]);

    const fetchSubmissions = async () => {
        try {
            const { data } = await getSubmissionsByEvent(eventId);
            setSubmissions(data.data || data || []);
        } catch (error) {
            console.error('Failed to fetch submissions', error);
            setError('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async (e) => {
        e.preventDefault();
        try {
            const { data } = await gradeSubmission(grading, gradeData);
            setSubmissions(submissions.map(s => s._id === data.data._id ? data.data : s));
            setGrading(null);
            setGradeData({ score: '', feedback: '' });
        } catch (error) {
            console.error('Failed to grade submission', error);
            alert('Failed to grade submission');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900">Project Submissions</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading submissions...</div>
                    ) : submissions.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">No submissions yet.</div>
                    ) : (
                        submissions.map(submission => (
                            <div key={submission._id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{submission.projectTitle}</h3>
                                        <p className="text-sm text-slate-500">by Team {submission.team?.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a href={submission.repoLink} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                                            <Github className="w-5 h-5 text-slate-700" />
                                        </a>
                                        {submission.demoLink && (
                                            <a href={submission.demoLink} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                                <ExternalLink className="w-5 h-5 text-blue-600" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <p className="text-slate-600 mb-6">{submission.description}</p>

                                {submission.attachments && submission.attachments.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Attachments</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {submission.attachments.map((file, index) => (
                                                <a
                                                    key={index}
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors"
                                                >
                                                    <div className="bg-white p-2 rounded shadow-sm">
                                                        {['jpg', 'jpeg', 'png', 'gif'].includes(file.type) ? (
                                                            <img src={file.url} alt={file.name} className="w-8 h-8 object-cover rounded" />
                                                        ) : (
                                                            <FileText className="w-8 h-8 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-slate-600 truncate flex-1">{file.name}</span>
                                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {submission.grade?.score ? (
                                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-green-900">Score: {submission.grade.score}/100</span>
                                        </div>
                                        <p className="text-green-800 text-sm">{submission.grade.feedback}</p>
                                    </div>
                                ) : (
                                    grading === submission._id ? (
                                        <form onSubmit={handleGrade} className="bg-slate-50 p-4 rounded-lg space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Score (0-100)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    required
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                                    value={gradeData.score}
                                                    onChange={e => setGradeData({ ...gradeData, score: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
                                                <textarea
                                                    required
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                                    rows="2"
                                                    value={gradeData.feedback}
                                                    onChange={e => setGradeData({ ...gradeData, feedback: e.target.value })}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
                                                    Save Grade
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setGrading(null)}
                                                    className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button
                                            onClick={() => setGrading(submission._id)}
                                            className="text-blue-600 font-semibold text-sm hover:text-blue-700"
                                        >
                                            Grade Project
                                        </button>
                                    )
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubmissionViewer;
