import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    BookOpen, 
    CheckCircle, 
    AlertCircle, 
    TrendingUp,
    Calendar,
    ArrowUpRight,
    Search,
    RefreshCw
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFaculty: 0,
        totalSubjects: 0,
        avgAttendance: 0
    });

    const chartData = [
        { name: 'Mon', attendance: 85 },
        { name: 'Tue', attendance: 88 },
        { name: 'Wed', attendance: 92 },
        { name: 'Thu', attendance: 89 },
        { name: 'Fri', attendance: 95 },
    ];

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <motion.div 
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-3xl"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${color}`}>
                    <Icon className="text-white" size={24} />
                </div>
                {trend && (
                    <div className="flex items-center text-emerald-500 text-xs font-bold">
                        <TrendingUp size={14} className="mr-1" />
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </motion.div>
    );

    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/subject/sync', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Admin Overview</h1>
                    <p className="text-slate-500">Welcome back, {user?.name}. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSync}
                        disabled={syncing}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
                        {syncing ? 'Syncing...' : 'Sync Student Data'}
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium flex items-center gap-2">
                        <Calendar size={18} />
                        Last 30 Days
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value="1,280" icon={Users} color="bg-blue-500" trend="+12%" />
                <StatCard title="Total Faculty" value="45" icon={Users} color="bg-indigo-500" />
                <StatCard title="Total Subjects" value="24" icon={BookOpen} color="bg-emerald-500" />
                <StatCard title="Avg Attendance" value="84%" icon={CheckCircle} color="bg-amber-500" trend="+5%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Attendance Trends</h2>
                        <select className="bg-transparent border-none text-sm font-medium text-slate-500 outline-none">
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="attendance" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                    <Users size={18} className="text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">New student enrolled</p>
                                    <p className="text-xs text-slate-500">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-xl transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
