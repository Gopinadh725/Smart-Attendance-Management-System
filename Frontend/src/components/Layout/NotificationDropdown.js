import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, 
    UserCheck, 
    Calendar, 
    Info, 
    X,
    MessageCircle
} from 'lucide-react';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const notifications = [
        { id: 1, type: 'attendance', title: 'Attendance Marked', desc: 'Your presence for CS401 was recorded.', time: '2 mins ago', icon: UserCheck, color: 'text-emerald-500 bg-emerald-100' },
        { id: 2, type: 'timetable', title: 'Schedule Update', desc: 'Tuesday\'s lab class moved to Room 302.', time: '1 hour ago', icon: Calendar, color: 'text-primary-500 bg-primary-100' },
        { id: 3, type: 'system', title: 'Device Binding', desc: 'Secure device link established successfully.', time: 'Yesterday', icon: Info, color: 'text-amber-500 bg-amber-100' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 border border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="font-bold flex items-center gap-2">
                                <Bell size={18} className="text-primary-600" />
                                Notifications
                            </h3>
                            <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 cursor-pointer group">
                                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${n.color}`}>
                                            <n.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold dark:text-white group-hover:text-primary-600 transition-colors uppercase tracking-tight">{n.title}</p>
                                                <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-slate-400">
                                    <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No new notifications</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 text-center border-t border-slate-100 dark:border-slate-800">
                            <button className="text-xs font-bold text-primary-600 hover:underline">Mark as read</button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
