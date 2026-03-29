import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Book, 
    Calendar, 
    CheckCircle, 
    ArrowRight,
    Edit3,
    TrendingUp,
    Plus,
    Loader2,
    CalendarDays
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LiveSession from '../../components/Attendance/LiveSession';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [stats, setStats] = useState([
        { title: 'Subjects Handling', value: '0', icon: Book, color: 'bg-indigo-500' },
        { title: 'Total Students', value: '0', icon: Users, color: 'bg-blue-500' },
        { title: 'Today\'s Classes', value: '0', icon: Calendar, color: 'bg-emerald-500' },
        { title: 'Attendance Rate', value: '0%', icon: CheckCircle, color: 'bg-amber-500' },
    ]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [subjectsRes, allocationsRes] = await Promise.all([
                    api.get('/subject'),
                    api.get('/allocations')
                ]);

                const fetchedSubjects = subjectsRes.data;
                const fetchedAllocations = allocationsRes.data;

                setSubjects(fetchedSubjects);
                setAllocations(fetchedAllocations);

                // Calculate stats
                const totalStudents = fetchedSubjects.reduce((acc, sub) => acc + (sub.enrolledStudents?.length || 0), 0);
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const todayClasses = fetchedAllocations.filter(a => a.day === today).length;

                setStats([
                    { title: 'Subjects Handling', value: fetchedSubjects.length.toString(), icon: Book, color: 'bg-indigo-500' },
                    { title: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'bg-blue-500' },
                    { title: 'Today\'s Classes', value: todayClasses.toString(), icon: Calendar, color: 'bg-emerald-500' },
                    { title: 'Attendance Rate', value: '---', icon: CheckCircle, color: 'bg-amber-500' },
                ]);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
                toast.error('Failed to update dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
                    <p className="text-slate-500">Welcome back, Prof. {user?.name?.split(' ')[0]}</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate('/faculty/manual-attendance')}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus size={18} />
                        Mark Attendance
                    </button>
                </div>
            </div>

            <LiveSession />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="glass p-6 rounded-3xl"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 shadow-lg shadow-inner`}>
                            <stat.icon className="text-white" size={24} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subjects Section */}
                <div className="glass p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Your Subjects</h2>
                        <button className="text-primary-600 font-semibold text-sm hover:underline">View All</button>
                    </div>
                    {subjects.length === 0 ? (
                        <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl opacity-50">
                            <Book size={40} className="mx-auto mb-4 text-slate-300" />
                            <p>No subjects assigned yet</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {subjects.map((sub, i) => (
                                <div key={i} className="group relative p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-500/30 transition-all overflow-hidden bg-white/50 dark:bg-slate-900/50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-lg font-bold">{sub.subjectName}</h4>
                                            <p className="text-slate-500 text-sm mb-4">
                                                Code: {sub.subjectCode} • Section {sub.section} • {sub.enrolledStudents?.length || 0} Students
                                            </p>
                                            <div className="flex items-center gap-6 text-sm">
                                                <span className="flex items-center gap-1.5 text-slate-400 capitalize">
                                                    <CalendarDays size={14} /> Sem {sub.semester}
                                                </span>
                                                <button 
                                                    onClick={() => navigate('/faculty/manual-attendance')}
                                                    className="flex items-center gap-1.5 text-primary-600 font-bold hover:underline"
                                                >
                                                    Manage Access <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Today's Schedule */}
                <div className="space-y-8">
                    <div className="glass p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6">Today's Schedule</h2>
                        <div className="space-y-4">
                            {allocations.filter(a => a.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })).length === 0 ? (
                                <p className="text-slate-500 text-center py-4">No classes scheduled for today</p>
                            ) : (
                                allocations
                                    .filter(a => a.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }))
                                    .map((slot, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-500/10">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-600">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                                                        {slot.startTime} - {slot.endTime}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{slot.subject?.subjectName} (Sec {slot.section})</p>
                                                </div>
                                            </div>
                                            <ArrowRight size={18} className="text-indigo-300" />
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => navigate('/faculty/manual-attendance')}
                                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            >
                                <Plus size={24} />
                                <span className="text-sm font-bold">Manual Marking</span>
                            </button>
                            <button className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-primary-50 dark:bg-primary-900/10 text-primary-600 hover:bg-primary-100 transition-colors opacity-50 cursor-not-allowed">
                                <Edit3 size={24} />
                                <span className="text-sm font-bold">Edit Records</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
