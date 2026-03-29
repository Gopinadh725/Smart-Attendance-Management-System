import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Calendar, 
    ChevronRight, 
    CheckCircle2, 
    XCircle,
    Search,
    Loader2,
    Save,
    QrCode
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';

const ManualAttendance = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    
    const [qrToken, setQrToken] = useState(null);
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrGenerating, setQrGenerating] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const { data } = await api.get('/subject');
            setSubjects(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load subjects');
            setLoading(false);
        }
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        const enrolled = subject.enrolledStudents || [];
        const validStudents = enrolled.filter(s => s && s._id && s._id.length > 5);
        setStudents(validStudents);
        
        // Initial state: ALL ABSENT as requested
        const initialData = {};
        validStudents.forEach(s => {
            initialData[s._id] = 'Absent';
        });
        setAttendanceData(initialData);
        
        // Fetch existing attendance for this date (QR scans might already be there)
        fetchExistingAttendance(subject._id, date, initialData);
    };

    const fetchExistingAttendance = async (subId, targetDate, initial) => {
        try {
            const { data } = await api.get(`/attendance/${subId}/${targetDate}`);
            if (data && data.students) {
                const mergedData = { ...initial };
                data.students.forEach(s => {
                    const id = s.studentId?._id || s.studentId;
                    if (id) mergedData[id] = s.status;
                });
                setAttendanceData(mergedData);
                toast.success('Synced existing records');
            }
        } catch (error) {
            // 404 is fine, means no records yet today
            console.log("No existing attendance for this date yet");
        }
    };

    // Re-fetch when date changes
    useEffect(() => {
        if (selectedSubject) {
            const enrolled = selectedSubject.enrolledStudents || [];
            const initial = {};
            enrolled.forEach(s => { initial[s._id] = 'Absent'; });
            fetchExistingAttendance(selectedSubject._id, date, initial);
        }
    }, [date]);

    const handleGenerateQR = async () => {
        setQrGenerating(true);
        try {
            const { data } = await api.post('/qr/generate');
            setQrToken(data.token);
            setShowQrModal(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Check if you have an active class in timetable right now');
        } finally {
            setQrGenerating(false);
        }
    };

    const handleSave = async () => {
        if (students.length === 0) {
            return toast.error('No students enrolled in this subject');
        }
        setSaving(true);
        try {
            const formattedStudents = Object.keys(attendanceData)
                .filter(id => id && id.length > 10) // Failsafe: only send valid IDs
                .map(id => ({
                    studentId: id,
                    status: attendanceData[id]
                }));

            if (formattedStudents.length === 0) {
                return toast.error('No valid students selected');
            }

            await api.post('/attendance/mark', {
                subjectId: selectedSubject._id,
                date,
                students: formattedStudents
            });

            toast.success('Attendance saved successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    if (loading && !selectedSubject) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Faculty Attendance</h1>
                    <p className="text-slate-500">Mark manually or generate QR codes</p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Calendar size={18} className="text-primary-600 ml-2" />
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-semibold pr-4"
                    />
                </div>
            </div>

            {!selectedSubject ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((sub) => (
                        <motion.button
                            key={sub._id}
                            whileHover={{ y: -5 }}
                            onClick={() => handleSubjectSelect(sub)}
                            className="glass p-6 text-left group relative overflow-hidden"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h3 className="font-bold text-lg">{sub.subjectName}</h3>
                            <p className="text-sm text-slate-500 mb-4">{sub.subjectCode} • Section {sub.section}</p>
                            <div className="flex items-center text-xs font-bold text-primary-600 uppercase tracking-wider">
                                Manage Class <ChevronRight size={14} className="ml-1" />
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-500/5 rounded-full" />
                        </motion.button>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 glass rounded-3xl border-primary-500/20 bg-primary-50/30 dark:bg-primary-900/10">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSelectedSubject(null)}
                                className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <ChevronRight size={20} className="rotate-180" />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold">{selectedSubject.subjectName}</h2>
                                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Section {selectedSubject.section} • {students.length} Students Enrolled</p>
                            </div>
                        </div>                        <div className="flex gap-4">
                            <button 
                                onClick={handleGenerateQR}
                                disabled={qrGenerating}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {qrGenerating ? <Loader2 className="animate-spin" size={20} /> : <QrCode size={20} />}
                                Generate QR
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {saving ? 'Saving...' : 'Save Manual'}
                            </button>
                        </div>
                    </div>

                    <div className="glass rounded-3xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-8 py-5">Roll No</th>
                                    <th className="px-8 py-5">Student Name</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-8 py-5 font-mono text-sm text-slate-500">{student.rollNumber || 'N/A'}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                                                    {student.name ? student.name[0] : '?'}
                                                </div>
                                                <span className="font-semibold">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => setAttendanceData(prev => ({...prev, [student._id]: 'Present'}))}
                                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                                        attendanceData[student._id] === 'Present' 
                                                        ? 'bg-emerald-500 text-white shadow-emerald-500/20 ring-2 ring-emerald-500/20' 
                                                        : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/30'
                                                    }`}
                                                >
                                                    <CheckCircle2 size={14} />
                                                    Present
                                                </button>
                                                <button 
                                                    onClick={() => setAttendanceData(prev => ({...prev, [student._id]: 'Absent'}))}
                                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                                        attendanceData[student._id] === 'Absent' 
                                                        ? 'bg-rose-500 text-white shadow-rose-500/20 ring-2 ring-rose-500/20' 
                                                        : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-rose-500/30'
                                                    }`}
                                                >
                                                    <XCircle size={14} />
                                                    Absent
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                    <Users size={32} />
                                </div>
                                <p className="text-slate-500 font-medium">No students enrolled in this subject yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* QR Modal */}
            <AnimatePresence>
                {showQrModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowQrModal(false)} />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[40px] relative z-10 w-full max-w-sm text-center shadow-2xl border border-white/20"
                        >
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <QrCode size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedSubject?.subjectName}</h3>
                                <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">Section {selectedSubject?.section}</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-3xl inline-block shadow-inner mb-6 border-4 border-slate-50">
                                <QRCodeCanvas value={qrToken} size={220} level="H" />
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                    <span className="flex items-center gap-1.2"><Calendar size={12} /> {new Date().toLocaleDateString()}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                    <span>Started: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-[10px] text-amber-600 font-bold uppercase py-2 px-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg inline-block">
                                    Expires in 5 minutes
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => setShowQrModal(false)}
                                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
                            >
                                Close Session
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManualAttendance;
