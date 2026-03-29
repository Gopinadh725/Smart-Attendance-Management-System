import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Trash2, 
    RefreshCw, 
    Shield, 
    Search,
    UserPlus,
    Loader2,
    MoreVertical,
    X,
    Save,
    Edit3
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Create User Modal State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student',
        rollNumber: '',
        section: '',
        semester: ''
    });
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editMode) {
                await api.put(`/admin/user/${selectedUserId}`, formData);
                toast.success('User updated successfully');
            } else {
                await api.post('/admin/user', formData);
                toast.success('User created successfully');
            }
            setShowModal(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (user) => {
        setEditMode(true);
        setSelectedUserId(user._id);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Keep empty for edits
            role: user.role,
            rollNumber: user.rollNumber || '',
            section: user.section || '',
            semester: user.semester || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditMode(false);
        setSelectedUserId(null);
        setFormData({ name: '', email: '', password: '', role: 'Student', rollNumber: '', section: '', semester: '' });
    };

    const handleResetDevice = async (id) => {
        if (!window.confirm('Are you sure you want to reset this user\'s device binding?')) return;
        try {
            await api.put(`/admin/user/${id}/reset-device`);
            toast.success('Device reset successful');
            fetchUsers();
        } catch (error) {
            toast.error('Reset failed');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/user/${id}`);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (u.rollNumber && u.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-slate-500">Manage students, faculty, and administrative access</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <UserPlus size={18} />
                    Add New User
                </button>
            </div>

            <div className="glass rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name, email or roll number..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <span className="text-sm text-slate-500 whitespace-nowrap">{filteredUsers.length} Users found</span>
                        <select 
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full md:w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <option value="All">All Roles</option>
                            <option value="Student">Student</option>
                            <option value="Faculty">Faculty</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-8 py-5">User Details</th>
                                    <th className="px-8 py-5">Role</th>
                                    <th className="px-8 py-5">Section/Sem</th>
                                    <th className="px-8 py-5">Device Binding</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center font-bold text-sm">
                                                    {u.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{u.name}</p>
                                                    <p className="text-xs text-slate-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                                                u.role === 'Admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' :
                                                u.role === 'Faculty' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20' :
                                                'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="text-sm font-semibold">
                                                {u.role === 'Student' ? (
                                                    u.section ? `Sec ${u.section} • Sem ${u.semester}` : 'Not Set'
                                                ) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${u.deviceId ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                                                <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                                    {u.deviceId ? u.deviceId.substring(0, 12) + '...' : 'Not Linked'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleEdit(u)}
                                                    title="Edit User"
                                                    className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-xl transition-all"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleResetDevice(u._id)}
                                                    disabled={!u.deviceId}
                                                    title="Reset Device Binding"
                                                    className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl transition-all disabled:opacity-30"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    title="Delete User"
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add User Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[40px] relative z-10 w-full max-w-lg shadow-2xl border border-white/20"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold">{editMode ? 'Edit User' : 'Add New User'}</h2>
                                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAddUser} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                                            <label className="text-sm font-bold ml-1">Full Name</label>
                                            <input 
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 border border-transparent focus:border-primary-500/30 transition-all font-medium"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                                            <label className="text-sm font-bold ml-1">Role</label>
                                            <select 
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 border border-transparent focus:border-primary-500/30 transition-all font-medium cursor-pointer"
                                                value={formData.role}
                                                onChange={e => setFormData({...formData, role: e.target.value})}
                                            >
                                                <option value="Student">Student</option>
                                                <option value="Faculty">Faculty</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                                        <label className="text-sm font-bold ml-1">Email Address</label>
                                        <input 
                                            required
                                            type="email"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 border border-transparent focus:border-primary-500/30 transition-all font-medium"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>

                                    <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                                        <label className="text-sm font-bold ml-1">Temporary Password</label>
                                        <input 
                                            required
                                            type="password"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 border border-transparent focus:border-primary-500/30 transition-all font-medium"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>

                                    {formData.role === 'Student' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                                                    <label className="text-sm font-bold ml-1">Section</label>
                                                    <select 
                                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 border border-transparent focus:border-primary-500/30 transition-all font-medium cursor-pointer"
                                                        value={formData.section || ''}
                                                        onChange={e => setFormData({...formData, section: e.target.value})}
                                                    >
                                                        <option value="">Select Section</option>
                                                        <option value="A">Section A</option>
                                                        <option value="B">Section B</option>
                                                        <option value="C">Section C</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                                                    <label className="text-sm font-bold ml-1">Semester</label>
                                                    <select 
                                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 border border-transparent focus:border-primary-500/30 transition-all font-medium cursor-pointer"
                                                        value={formData.semester || ''}
                                                        onChange={e => setFormData({...formData, semester: e.target.value})}
                                                    >
                                                        <option value="">Select Sem</option>
                                                        {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                                                <label className="text-sm font-bold ml-1">Roll Number</label>
                                                <input 
                                                    required
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 border border-transparent focus:border-primary-500/30 transition-all font-medium"
                                                    placeholder="MCA-2024-001"
                                                    value={formData.rollNumber}
                                                    onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button 
                                    disabled={saving}
                                    type="submit" 
                                    className="w-full py-4 bg-primary-600 text-white rounded-[24px] font-bold shadow-xl shadow-primary-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {saving ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update User' : 'Create User Account')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUserManagement;
