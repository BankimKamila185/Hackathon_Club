import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvent } from '../../context/EventContext';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useEvent();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData);
            navigate('/overview');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to continue to HackClub</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                        Sign In <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
