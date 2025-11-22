import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { getSubmissionsByEvent, gradeSubmission } from '../services/submissionService';
import { getEventById } from '../services/eventService';
import { Github, ExternalLink, Star, ArrowLeft, FileText, Download } from 'lucide-react';

const JudgeDashboard = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useEvent();
    const [event, setEvent] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [grading, setGrading] = useState(null);
    const [gradeData, setGradeData] = useState({ score: '', feedback: '' });
    const [filter, setFilter] = useState('all'); // 'all', 'graded', 'pending'

    useEffect(() => {
        fetchData();
    }, [eventId]);

    const fetchData = async () => {
        try {
            const [eventRes, submissionsRes] = await Promise.all([
                getEventById(eventId),
                getSubmissionsByEvent(eventId)
            ]);
            setEvent(eventRes.data);
            setSubmissions(submissionsRes.data.data || submissionsRes.data || []);
        } catch (error) {
            console.error('Failed to fetch data', error);
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

    const filteredSubmissions = submissions.filter(s => {
        if (filter === 'graded') return s.grade?.score;
        if (filter === 'pending') return !s.grade?.score;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-500">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate(`/events/${eventId}`)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Event
                </button>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Judge Dashboard</h1>
                        <p className="text-slate-600">Grading submissions for <span className="font-semibold">{event?.title}</span></p>
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
                        {['all', 'pending', 'graded'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filteredSubmissions.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center text-slate-500">
                            No submissions found matching the filter.
                        </div>
                    ) : (
                        filteredSubmissions.map(submission => (
                            <div key={submission._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-1">{submission.projectTitle}</h3>
                                            <p className="text-sm text-slate-500">Team: {submission.team?.name}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={submission.repoLink} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700" title="Repository">
                                                <Github className="w-5 h-5" />
                                            </a>
                                            {submission.demoLink && (
                                                <a href={submission.demoLink} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 text-blue-600" title="Live Demo">
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-slate-600 mb-6 whitespace-pre-wrap">{submission.description}</p>

                                    {submission.attachments && submission.attachments.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Attachments</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {submission.attachments.map((file, index) => (
                                                    <a
                                                        key={index}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors text-sm text-slate-700"
                                                    >
                                                        {['jpg', 'jpeg', 'png', 'gif'].includes(file.type) ? (
                                                            <ImageIcon className="w-4 h-4 text-blue-500" />
                                                        ) : (
                                                            <FileText className="w-4 h-4 text-slate-500" />
                                                        )}
                                                        <span className="truncate max-w-[150px]">{file.name}</span>
                                                        <Download className="w-3 h-3 text-slate-400" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t border-slate-100 pt-6">
                                        {submission.grade?.score ? (
                                            <div className="flex items-start justify-between bg-green-50 p-4 rounded-xl border border-green-100">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                                        <span className="font-bold text-green-900">Score: {submission.grade.score}/100</span>
                                                    </div>
                                                    <p className="text-green-800 text-sm">{submission.grade.feedback}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setGrading(submission._id);
                                                        setGradeData({
                                                            score: submission.grade.score,
                                                            feedback: submission.grade.feedback
                                                        });
                                                    }}
                                                    className="text-green-700 hover:text-green-900 text-sm font-medium"
                                                >
                                                    Edit Grade
                                                </button>
                                            </div>
                                        ) : (
                                            grading === submission._id ? (
                                                <form onSubmit={handleGrade} className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                                    <h4 className="font-semibold text-slate-900 mb-4">Grade Submission</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                        <div className="md:col-span-1">
                                                            <label className="block text-sm font-medium text-slate-700 mb-1">Score (0-100)</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                required
                                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                                value={gradeData.score}
                                                                onChange={e => setGradeData({ ...gradeData, score: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="md:col-span-3">
                                                            <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
                                                            <input
                                                                type="text"
                                                                required
                                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                                placeholder="Constructive feedback..."
                                                                value={gradeData.feedback}
                                                                onChange={e => setGradeData({ ...gradeData, feedback: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setGrading(null)}
                                                            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                                                        >
                                                            Submit Grade
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setGrading(submission._id);
                                                        setGradeData({ score: '', feedback: '' });
                                                    }}
                                                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                >
                                                    Grade this submission
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper icon component
const ImageIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
);

export default JudgeDashboard;
