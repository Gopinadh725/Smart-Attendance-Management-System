import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    UserCheck, 
    FileBarChart, 
    Settings, 
    LogOut, 
    Menu, 
    X, 
    Bell, 
    ChevronRight,
    Users,
    QrCode,
    Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Faculty', 'Student'] },
        { name: 'Manual Marking', path: '/faculty/manual-attendance', icon: UserCheck, roles: ['Faculty'] },
        { name: 'Attendance', path: '/attendance', icon: UserCheck, roles: ['Faculty', 'Student'] },
        { name: 'Reports', path: '/reports', icon: FileBarChart, roles: ['Admin', 'Faculty', 'Student'] },
        { name: 'Timetable', path: '/admin/allocations', icon: Calendar, roles: ['Admin'] },
        { name: 'Manage Users', path: '/admin/users', icon: Users, roles: ['Admin'] },
        { name: 'QR Scan', path: '/qr-scanner', icon: QrCode, roles: ['Student'] },
        { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'Faculty', 'Student'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? '280px' : '0px', x: isOpen ? 0 : -280 }}
                className="fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 overflow-hidden lg:relative lg:translate-x-0"
                style={{ width: isOpen ? '280px' : 'auto' }}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-10">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg" />
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                AttendX
                            </span>
                        </Link>
                        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {filteredItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                                        isActive 
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium' 
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && <motion.div layoutId="active-pill" className="w-1.5 h-1.5 bg-primary-600 rounded-full" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button 
                            onClick={logout}
                            className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
