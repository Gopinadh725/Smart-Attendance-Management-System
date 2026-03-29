import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu, Sun, Moon, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ toggleSidebar }) => {
    const { user } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [showNotifications, setShowNotifications] = React.useState(false);

    return (
        <header className="sticky top-0 z-30 w-full glass dark:bg-slate-900/50">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleSidebar} 
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full lg:hidden"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Search size={18} className="text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="bg-transparent border-none outline-none text-sm w-40 lg:w-60"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleDarkMode}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
                    </button>

                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative"
                        >
                            <Bell size={18} className="text-slate-600 dark:text-slate-400" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                        </button>
                        <NotificationDropdown 
                            isOpen={showNotifications} 
                            onClose={() => setShowNotifications(false)} 
                        />
                    </div>

                    <div className="w-px h-6 bg-slate-200 dark:border-slate-800 mx-2" />

                    <motion.div 
                        whileHover={{ y: -1 }}
                        className="flex items-center gap-3 pl-2 cursor-pointer group"
                    >
                        <div className="hidden text-right lg:block">
                            <p className="text-sm font-semibold">{user?.name || 'Guest'}</p>
                            <p className="text-xs text-slate-500">{user?.role || 'Sign In'}</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <ChevronDown size={16} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                    </motion.div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
