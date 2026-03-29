import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    User, 
    Lock, 
    Bell, 
    Smartphone, 
    Moon, 
    Sun, 
    Shield, 
    Check,
    ChevronRight,
    Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const { user, deviceId } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'device', label: 'Device Binding', icon: Smartphone }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all ${
                                activeTab === tab.id 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 font-semibold' 
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="glass p-8 rounded-3xl space-y-8">
                        {activeTab === 'profile' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-3xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl font-bold text-primary-600">
                                            {user?.name?.[0]}
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-primary-600 transition-colors">
                                            <Camera size={16} />
                                        </button>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold dark:text-white">{user?.name}</h2>
                                        <p className="text-slate-500">{user?.role} • {user?.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase text-slate-400 ml-1">Full Name</label>
                                        <input type="text" defaultValue={user?.name} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase text-slate-400 ml-1">Email Address</label>
                                        <input type="email" defaultValue={user?.email} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                </div>
                                
                                <button className="btn-primary w-full md:w-auto px-10">Save Changes</button>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h3 className="text-lg font-bold">Change Password</h3>
                                <div className="space-y-4">
                                    <input type="password" placeholder="Current Password" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none" />
                                    <input type="password" placeholder="New Password" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none" />
                                    <input type="password" placeholder="Confirm New Password" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <button className="btn-primary">Update Password</button>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <h3 className="text-lg font-bold mb-4">Preference Control</h3>
                                {[
                                    { label: 'Push Notifications', desc: 'Get real-time alerts on your device' },
                                    { label: 'Email Reports', desc: 'Receive weekly attendance summaries' },
                                    { label: 'Timetable Updates', desc: 'Notify when schedule changes' }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                                        <div>
                                            <p className="font-semibold text-sm">{item.label}</p>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                        <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'device' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="flex items-center gap-4 p-6 rounded-3xl bg-primary-50 dark:bg-primary-900/10 border border-primary-500/20">
                                    <Shield className="text-primary-600" size={32} />
                                    <div>
                                        <h3 className="font-bold text-primary-600">Current Device Linked</h3>
                                        <p className="text-xs text-primary-600/70">Your account is secured by device binding.</p>
                                    </div>
                                    <Check className="ml-auto text-primary-600" />
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Unique Hardware ID</label>
                                        <p className="font-mono text-sm mt-1">{deviceId}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 italic">
                                        Note: If you plan to switch devices, please logout first to clear the binding. 
                                        If your device is lost, contact an administrator to reset your access.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-between items-center px-6">
                        <button onClick={toggleDarkMode} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors">
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                            <span>Switch to {darkMode ? 'Light' : 'Dark'} Mode</span>
                        </button>
                        <span className="text-xs text-slate-400">MCA Attendance System v1.2</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
