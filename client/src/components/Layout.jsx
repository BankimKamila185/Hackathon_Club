import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Users, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';

const Layout = () => {
    const { currentUser: user, userRole, logout } = useAuth();

    const navItems = [
        { path: '/overview', label: 'Overview', icon: LayoutDashboard },
        { path: '/upcoming', label: 'Upcoming', icon: Calendar },
        { path: '/teams', label: 'Teams', icon: Users },
        ...(['lead', 'co-lead', 'admin'].includes(userRole) ? [{ path: '/admin', label: 'Admin', icon: Settings }] : []),
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
                                <span className="text-xl font-bold text-slate-800">HackClub</span>
                            </div>

                            <div className="hidden sm:flex sm:space-x-1">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            clsx(
                                                'inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200',
                                                isActive
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            )
                                        }
                                    >
                                        <item.icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-600 hidden sm:block">Hi, {user.displayName || user.email}</span>
                                    <button
                                        onClick={logout}
                                        className="text-sm px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                        {(user.displayName || user.email).charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <NavLink
                                        to="/login"
                                        className="text-sm px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium"
                                    >
                                        Log In
                                    </NavLink>
                                    <NavLink
                                        to="/register"
                                        className="text-sm px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-500/30"
                                    >
                                        Register
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
