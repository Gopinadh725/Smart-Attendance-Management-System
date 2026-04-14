import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, Sun, Moon, Search, ChevronDown, User, LogOut, Settings, Mail, Fingerprint } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 w-full glass dark:bg-slate-900/50">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full lg:hidden">
                        <Menu size={20} />
                    </button>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-40 lg:w-60" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={toggleDarkMode} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
                    </button>

                    <div className="relative">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                            <Bell size={18} className="text-slate-600 dark:text-slate-400" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                        </button>
                        <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
                    </div>

                    <div className="w-px h-6 bg-slate-200 dark:border-slate-800 mx-2" />

                    {/* Profile Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <motion.div 
                            whileHover={{ y: -1 }}
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 pl-2 cursor-pointer group"
                        >
                            <div className="hidden text-right lg:block">
                                <p className="text-sm font-semibold">{user?.name || 'Guest'}</p>
                                <p className="text-xs text-slate-500">{user?.role}</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                        </motion.div>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-4 w-64 glass border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden py-2"
                                >
                                    {/* User Info Header */}
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                            <Mail size={12} />
                                            <span>{user?.email}</span>
                                        </div>
                                        {user?.rollNumber && (
                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                <Fingerprint size={12} />
                                                <span>Reg No: {user?.rollNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                    

                                    
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        Logout Session
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;