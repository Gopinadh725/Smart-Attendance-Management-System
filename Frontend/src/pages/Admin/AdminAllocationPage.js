import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    Clock, 
    Book, 
    User as UserIcon, 
    Plus, 
    Trash2, 
    Edit3,
    TrendingUp,
    Briefcase,
    Layers,
    AlertTriangle,
    Info
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminAllocationPage = () => {
    const [allocations, setAllocations] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [formData, setFormData] = useState({
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        subjectId: '',
        facultyId: '',
        section: 'A'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [allocRes, subRes, userRes] = await Promise.all([
                api.get('/allocations'),
                api.get('/subject'),
                api.get('/admin/users')
            ]);
            setAllocations(allocRes.data);
            setSubjects(subRes.data);
            setFaculties(userRes.data.filter(u => u.role === 'Faculty'));
            setLoading(false);
        } catch (error) {
            console.error("Fetch Error Details:", error.response || error);
            const msg = error.response?.data?.message || 'Check connection or login again';
            toast.error(`Fetch failed: ${msg}`);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.put(`/allocations/${editingId}`, formData);
                toast.success('Allocation updated successfully');
            } else {
                await api.post('/allocations', formData);
                toast.success('Allocation created successfully');
            }
            handleCloseModal();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Conflict detected or server error');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            day: item.day,
            startTime: item.startTime,
            endTime: item.endTime,
            subjectId: item.subject?._id,
            facultyId: item.faculty?._id,
            section: item.section || 'A'
        });
        setEditingId(item._id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setEditingId(null);
        setFormData({
            day: 'Monday',
            startTime: '09:00',
            endTime: '10:00',
            subjectId: '',
            facultyId: '',
            section: 'A'
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this allocation?')) {
            try {
                await api.delete(`/allocations/${id}`);
                toast.success('Allocation removed');
                fetchData();
            } catch (error) {
                toast.error('Failed to remove allocation');
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Timetable Allocation
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Assign subjects and periods to faculty members.
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-primary-500/25"
                >
                    <Plus size={20} />
                    New Allocation
                </motion.button>
            </div>

            {/* Timetable Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allocations.map((item, idx) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass p-6 rounded-2xl relative group overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
                                <Book size={24} />
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => handleEdit(item)}
                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                                >
                                    <Edit3 size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(item._id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            {item.subject?.subjectName}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Code: {item.subject?.subjectCode} | Section: {item.section}
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <Calendar size={16} />
                                <span>{item.day}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <Clock size={16} />
                                <span>{item.startTime} - {item.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <UserIcon size={16} />
                                <span>Faculty: {item.faculty?.name || 'Unknown'}</span>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 -mr-16 -mt-16 rounded-full" />
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl border border-white/20 dark:border-slate-800"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            {editMode ? <Edit3 className="text-primary-600" /> : <Plus className="text-primary-600" />}
                            {editMode ? 'Edit Allocation' : 'Add New Allocation'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Day</label>
                                <select 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                    value={formData.day}
                                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                                >
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Start Time</label>
                                    <input 
                                        type="time"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">End Time</label>
                                    <input 
                                        type="time"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Subject</label>
                                <select 
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={formData.subjectId}
                                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => (
                                        <option key={s._id} value={s._id}>
                                            {s.subjectName} (Sec: {s.section} | Sem: {s.semester})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Faculty</label>
                                <select 
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={formData.facultyId}
                                    onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                                >
                                    <option value="">Select Faculty</option>
                                    {faculties.map(f => (
                                        <option key={f._id} value={f._id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Section</label>
                                <input 
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="e.g. A"
                                    value={formData.section}
                                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                                />
                            </div>

                            <button className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/25 mt-4">
                                {editMode ? 'Update Allocation' : 'Create Allocation'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminAllocationPage;
