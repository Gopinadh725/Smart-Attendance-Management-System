import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle, 
    XCircle, 
    Book, 
    Clock, 
    AlertTriangle,
    ArrowRight,
    TrendingUp
} from 'lucide-react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [attendanceData, setAttendanceData] = useState([]);

    const data = [
        { name: 'Present', value: 78, color: '#10b981' },
        { name: 'Absent', value: 22, color: '#f43f5e' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <p className="text-slate-500">Tracking your academic progress</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-3xl bg-emerald-500/5 border-emerald-500/10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mb-4">
                                <CheckCircle className="text-white" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm">Overall Attendance</p>
                            <h3 className="text-2xl font-bold">82.5%</h3>
                        </div>
                        <div className="glass p-6 rounded-3xl bg-blue-500/5 border-blue-500/10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center mb-4">
                                <Book className="text-white" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm">Total Classes</p>
                            <h3 className="text-2xl font-bold">148</h3>
                        </div>
                        <div className="glass p-6 rounded-3xl bg-amber-500/5 border-amber-500/10">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center mb-4">
                                <Clock className="text-white" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm">Late Marks</p>
                            <h3 className="text-2xl font-bold">4</h3>
                        </div>
                    </div>

                    {/* Subject Wise List */}
                    <div className="glass p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6">Subject Wise Attendance</h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Machine Learning', code: 'CS401', percent: 85 },
                                { name: 'Cloud Computing', code: 'CS402', percent: 68 },
                                { name: 'Cyber Security', code: 'CS403', percent: 92 },
                                { name: 'Mobile App Dev', code: 'CS404', percent: 76 },
                            ].map((subject, i) => (
                                <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-primary-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                                            {subject.code.slice(-2)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{subject.name}</p>
                                            <p className="text-xs text-slate-500">{subject.code}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className={`font-bold ${subject.percent < 75 ? 'text-red-500' : 'text-emerald-500'}`}>{subject.percent}%</p>
                                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${subject.percent < 75 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${subject.percent}%` }}
                                                />
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
                    {/* Pie Chart Card */}
                    <div className="glass p-8 rounded-3xl flex flex-col items-center">
                        <h2 className="text-lg font-bold mb-6 w-full text-left">Attendance Ratio</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-6 mt-4">
                            {data.map(item => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-medium text-slate-500">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Defaulter Alert */}
                    <motion.div 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20"
                    >
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-red-600">Attendance Alert!</h4>
                                <p className="text-sm text-red-600/70 mt-1">Your attendance in Cloud Computing (CS402) is 68%, which is below the required 75% threshold.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
