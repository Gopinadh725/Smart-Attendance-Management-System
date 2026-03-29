import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    QrCode, 
    Users, 
    Clock, 
    Book, 
    CheckCircle, 
    AlertCircle,
    Loader2
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

const LiveSession = () => {
    const [activeSession, setActiveSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrToken, setQrToken] = useState(null);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        checkActiveSession();
        const interval = setInterval(checkActiveSession, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const checkActiveSession = async () => {
        try {
            const res = await api.post('/qr/generate'); // This route detects active class and returns a token if it exists
            if (res.data.token) {
                setQrToken(res.data.token);
                setCountdown(res.data.expiresIn);
                setActiveSession(res.data);
            }
            setLoading(false);
        } catch (error) {
            setActiveSession(null);
            setLoading(false);
        }
    };

    const startAttendance = async () => {
        setLoading(true);
        try {
            const res = await api.post('/qr/generate');
            setQrToken(res.data.token);
            setCountdown(300); // 5 minutes
            setActiveSession(res.data);
            toast.success('Attendance session started');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cannot start session');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => setCountdown(c => c - 1), 1000);
            return () => clearInterval(timer);
        } else {
            setQrToken(null);
        }
    }, [countdown]);

    if (loading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-primary-600" size={40} />
        </div>
    );

    return (
        <div className="space-y-6">
            <AnimatePresence mode="wait">
                {!activeSession ? (
                    <motion.div
                        key="no-session"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass p-8 rounded-3xl text-center flex flex-col items-center gap-4"
                    >
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                            <Clock size={48} className="text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white">No active class scheduled now</h2>
                        <p className="text-slate-500 max-w-sm">
                            You can only start an attendance session during your allocated timetable period.
                        </p>
                        <button 
                            onClick={checkActiveSession}
                            className="mt-4 px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all"
                        >
                            Refresh Status
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="active-session"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {/* Session Details */}
                        <div className="glass p-8 rounded-3xl space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600">
                                    <Book size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold dark:text-white">Live Attendance</h2>
                                    <p className="text-primary-600 font-medium">Session Active</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <span className="text-slate-500 font-medium">Subject</span>
                                    <span className="font-bold dark:text-white">{activeSession.subject?.subjectName || 'In Progress'}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <span className="text-slate-500 font-medium">Section</span>
                                    <span className="font-bold dark:text-white">{activeSession.section}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <span className="text-slate-500 font-medium">Time Remaining</span>
                                    <span className={`font-mono font-bold text-xl ${countdown < 60 ? 'text-red-500 animate-pulse' : 'text-primary-600'}`}>
                                        {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    <Users size={16} />
                                    Student Activity
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-slate-500 font-medium">Students are scanning...</span>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Display */}
                        <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                            {qrToken ? (
                                <div className="bg-white p-6 rounded-3xl shadow-2xl mb-6">
                                    <QRCodeSVG value={qrToken} size={256} level="H" />
                                </div>
                            ) : (
                                <div className="w-64 h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                                    <AlertCircle size={64} className="text-slate-300" />
                                </div>
                            )}
                            <h3 className="text-xl font-bold dark:text-white mb-2">Display this to Students</h3>
                            <p className="text-slate-500 text-sm max-w-xs">
                                Students can scan this code from their dashboard using the camera.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiveSession;
