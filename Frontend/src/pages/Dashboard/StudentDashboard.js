import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Book, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        overallPercentage: 0,
        totalClasses: 0,
        totalPresent: 0,
        lateMarks: 0,
        subjectWiseData: []
    });
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            // Log this to your browser console to see if it's null!
            const token = localStorage.getItem('token'); 
            console.log("Using Token:", token);

            if (!token) {
                console.error("No token found! Redirecting to login...");
                return;
            }

            const res = await axios.get('http://localhost:5000/api/attendance/student-stats', {
                headers: { 
                    // Make sure 'Bearer' has a space after it
                    Authorization: `Bearer ${token}` 
                }
            });
            
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching stats:", err.response?.data || err.message);
            setLoading(false);
        }
    };
    fetchDashboardData();
}, []);

    const pieData = [
        { name: 'Present', value: Number(stats.totalPresent), color: '#10b981' },
        { name: 'Absent', value: stats.totalClasses - stats.totalPresent, color: '#f43f5e' },
    ];

    if (loading) return <div className="p-10 text-center">Loading Real-time Stats...</div>;

    // Find a subject below 75% for the alert
    const lowAttendanceSubject = stats.subjectWiseData.find(s => s.percent < 75);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <p className="text-slate-500">Tracking your academic progress in real-time</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-3xl bg-emerald-500/5 border-emerald-500/10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mb-4"><CheckCircle className="text-white" size={24} /></div>
                            <p className="text-slate-500 text-sm">Overall Attendance</p>
                            <h3 className="text-2xl font-bold">{stats.overallPercentage}%</h3>
                        </div>
                        <div className="glass p-6 rounded-3xl bg-blue-500/5 border-blue-500/10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center mb-4"><Book className="text-white" size={24} /></div>
                            <p className="text-slate-500 text-sm">Total Classes</p>
                            <h3 className="text-2xl font-bold">{stats.totalClasses}</h3>
                        </div>
                        <div className="glass p-6 rounded-3xl bg-amber-500/5 border-amber-500/10">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center mb-4"><Clock className="text-white" size={24} /></div>
                            <p className="text-slate-500 text-sm">Late Marks</p>
                            <h3 className="text-2xl font-bold">{stats.lateMarks}</h3>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6">Subject Wise Attendance</h2>
                        <div className="space-y-4">
                            {stats.subjectWiseData.map((subject, i) => (
                                <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-primary-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">{subject.code.slice(-2)}</div>
                                        <div>
                                            <p className="font-semibold">{subject.name}</p>
                                            <p className="text-xs text-slate-500">{subject.code}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className={`font-bold ${subject.percent < 75 ? 'text-red-500' : 'text-emerald-500'}`}>{subject.percent}%</p>
                                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                                <div className={`h-full transition-all duration-1000 ${subject.percent < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${subject.percent}%` }} />
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-3xl flex flex-col items-center">
                        <h2 className="text-lg font-bold mb-6 w-full text-left">Attendance Ratio</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {lowAttendanceSubject && (
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-red-600">Attendance Alert!</h4>
                                    <p className="text-sm text-red-600/70 mt-1">Your attendance in {lowAttendanceSubject.name} ({lowAttendanceSubject.code}) is {lowAttendanceSubject.percent}%, which is below the required 75% threshold.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;