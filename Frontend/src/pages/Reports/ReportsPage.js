import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, 
    Download, 
    Filter, 
    Search, 
    Calendar,
    ArrowUpRight,
    Loader2,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const { data } = await api.get('/subject');
                setSubjects(data);
            } catch (error) {
                toast.error('Failed to load subjects');
            }
        };
        fetchSubjects();
    }, []);

    const handleExportExcel = async () => {
        if (!selectedSubject) return;
        setExporting(true);
        try {
            const { data } = await api.get(`/reports/data/${selectedSubject}`);
            const { subject, attendances, enrolledStudents } = data;

            // Prepare header
            const headers = ['Roll Number', 'Student Name'];
            attendances.forEach(record => {
                headers.push(new Date(record.date).toLocaleDateString());
            });
            headers.push('Attendance %');

            // Prepare rows
            const rows = enrolledStudents.map(student => {
                const row = [student.rollNumber || 'N/A', student.name];
                let presentCount = 0;
                attendances.forEach(record => {
                    const status = record.students.find(s => 
                        s.studentId && (s.studentId._id === student._id || s.studentId === student._id)
                    )?.status || 'Absent';
                    row.push(status === 'Present' ? 'P' : 'A');
                    if (status === 'Present') presentCount++;
                });
                row.push(attendances.length > 0 ? ((presentCount / attendances.length) * 100).toFixed(0) + '%' : '0%');
                return row;
            });

            const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
            XLSX.writeFile(wb, `Attendance_${subject.subjectCode}.xlsx`);
            
            toast.success('Excel generated successfully!');
        } catch (error) {
            console.error("Excel Export Error:", error);
            toast.error('Failed to generate Excel');
        } finally {
            setExporting(false);
        }
    };

    const handleExportPDF = async () => {
        if (!selectedSubject) return;
        setExporting(true);
        try {
            const { data } = await api.get(`/reports/data/${selectedSubject}`);
            const { subject, attendances, enrolledStudents } = data;

            const doc = new jsPDF('l', 'mm', 'a4');
            
            doc.setFontSize(20);
            doc.setTextColor(79, 70, 229);
            doc.text(`Attendance Report: ${subject.subjectName}`, 14, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Subject: ${subject.subjectCode} | Faculty: ${subject.faculty?.name || 'N/A'}`, 14, 28);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

            const head = [['Roll No', 'Name']];
            attendances.forEach(record => {
                head[0].push(new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }));
            });
            head[0].push('%');

            const body = enrolledStudents.map(student => {
                const row = [student.rollNumber || 'N/A', student.name];
                let presentCount = 0;
                attendances.forEach(record => {
                    const attObj = record.students.find(s => 
                        s.studentId && (s.studentId._id === student._id || s.studentId === student._id)
                    );
                    const isPresent = attObj?.status === 'Present';
                    row.push(isPresent ? 'P' : 'A');
                    if (isPresent) presentCount++;
                });
                row.push(attendances.length > 0 ? ((presentCount / attendances.length) * 100).toFixed(0) + '%' : '0%');
                return row;
            });

            autoTable(doc, {
                head: head,
                body: body,
                startY: 40,
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229] },
                styles: { fontSize: 7 }
            });

            doc.save(`Attendance_${subject.subjectCode}.pdf`);
            toast.success('PDF generated successfully!');
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast.error(`PDF failed: ${error.message}`);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Attendance Reports</h1>
                    <p className="text-slate-500">Generate and export comprehensive attendance data</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6">Export Options</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1 text-slate-500">Subject</label>
                                <select 
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none"
                                >
                                    <option value="">Choose a subject...</option>
                                    {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
                                </select>
                            </div>

                            <button 
                                onClick={handleExportExcel}
                                disabled={!selectedSubject || exporting}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {exporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                                Export to Excel (.xlsx)
                            </button>

                            <button 
                                onClick={handleExportPDF}
                                disabled={!selectedSubject || exporting}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {exporting ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                                Export to PDF (.pdf)
                            </button>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl bg-primary-600 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Automated Reports</h3>
                            <p className="text-primary-100 text-sm">Schedule monthly attendance reports to be sent via email automatically.</p>
                            <button className="mt-6 px-4 py-2 bg-white text-primary-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-50 transition-colors">Configure Now</button>
                        </div>
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    </div>
                </div>

                <div className="lg:col-span-2 glass p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Recent Generations</h2>
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-500">Filters</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'Monthly_Attendance_Mar24.xlsx', date: 'Mar 22, 2024', size: '2.4 MB', status: 'ready' },
                            { name: 'Semester_Defaulters_List.pdf', date: 'Mar 20, 2024', size: '1.1 MB', status: 'ready' },
                            { name: 'Machine_Learning_Report.xlsx', date: 'Mar 15, 2024', size: '3.2 MB', status: 'expired' },
                        ].map((report, i) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-primary-500/30 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.status === 'ready' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold group-hover:text-primary-600 transition-colors">{report.name}</p>
                                        <p className="text-xs text-slate-500">{report.date} • {report.size}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {report.status === 'ready' ? (
                                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                            <CheckCircle2 size={14} /> Ready
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-50 px-2 py-1 rounded-lg">
                                            <XCircle size={14} /> Expired
                                        </div>
                                    )}
                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                        <ArrowUpRight size={20} className="text-slate-300 group-hover:text-primary-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
