import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    FileText, 
    Download, 
    CheckCircle, 
    XCircle,
    TrendingUp,
    ShieldAlert
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentAttendance = () => {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/attendance/my-report', {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
                });
                setReport(data);
            } catch (error) {
                // Mock data for demo if API fails
                setReport([
                    { subjectName: 'Machine Learning', subjectCode: 'CS401', present: 18, total: 20, percentage: '90.00' },
                    { subjectName: 'Cloud Computing', subjectCode: 'CS402', present: 11, total: 20, percentage: '55.00' },
                    { subjectName: 'Cyber Security', subjectCode: 'CS403', present: 19, total: 20, percentage: '95.00' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Attendance</h1>
                    <p className="text-slate-500">View your subject-wise attendance performance</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Download size={18} />
                    Download PDF Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.map((sub, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-6 rounded-3xl relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 p-4 ${parseFloat(sub.percentage) < 75 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {parseFloat(sub.percentage) < 75 ? <ShieldAlert size={24} /> : <CheckCircle size={24} />}
                        </div>
                        
                        <h3 className="text-lg font-bold pr-8">{sub.subjectName}</h3>
                        <p className="text-slate-500 text-xs font-mono mb-6">{sub.subjectCode}</p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-3xl font-bold">{sub.percentage}%</p>
                                    <p className="text-xs text-slate-500 mt-1">{sub.present} present out of {sub.total}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xs font-bold uppercase tracking-wider ${parseFloat(sub.percentage) < 75 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {parseFloat(sub.percentage) < 75 ? 'Shortage' : 'Safe'}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${sub.percentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full ${parseFloat(sub.percentage) < 75 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                            <button className="text-xs font-bold text-primary-600 hover:underline">History</button>
                            <button className="text-xs font-bold text-slate-400 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                                Details <TrendingUp size={12} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Attendance Defaulter Policy Card */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2">Defaulter Policy Notice</h2>
                    <p className="text-slate-400 text-sm max-w-2xl">Students must maintain a minimum of 75% attendance in each subject to be eligible for university examinations. Failure to do so will result in attendance shortage penalties.</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
            </div>
        </div>
    );
};

export default StudentAttendance;
