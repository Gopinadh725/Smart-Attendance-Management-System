import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    CheckCircle2, 
    Smartphone, 
    ShieldCheck, 
    BarChart3, 
    ArrowRight,
    Users,
    Zap,
    Globe
} from 'lucide-react';

const LandingPage = () => {
    const features = [
        { 
            title: 'Device Binding', 
            desc: 'Secure one-device login policy to prevent proxy attendance.', 
            icon: Smartphone, 
            color: 'bg-blue-500' 
        },
        { 
            title: 'Real-time Analytics', 
            desc: 'Instant insights for students and faculty with beautiful charts.', 
            icon: BarChart3, 
            color: 'bg-indigo-500' 
        },
        { 
            title: 'Role-Based Access', 
            desc: 'Tailored experiences for Students, Faculty, and Admin roles.', 
            icon: ShieldCheck, 
            color: 'bg-emerald-500' 
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                        <CheckCircle2 className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                        AttendX
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Login</Link>
                    <Link to="/register" className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-xl active:scale-95 transition-all">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-8 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-bold uppercase tracking-widest mb-6">
                        <Zap size={14} />
                        The Future of Attendance
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-8">
                        Smart Attendance <br />
                        <span className="text-primary-600">Reimagined.</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-lg">
                        A production-ready Student Attendance Management System with biometrically-secure device binding and real-time analytics.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2 group transition-all">
                            Get Started Free
                            <ArrowRight className="group-hover:translate-x-1 transition-all" size={20} />
                        </Link>
                        <button className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            View Demo
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-8">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-slate-200" />
                            ))}
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                            Trusted by <span className="text-slate-900 dark:text-white font-bold">500+</span> Universities
                        </p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-primary-500/20 blur-[100px] rounded-full" />
                    <div className="glass rounded-[40px] p-2 relative">
                        <div className="bg-slate-900 rounded-[38px] p-4 overflow-hidden shadow-2xl">
                             <img 
                                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                                alt="App Screenshot" 
                                className="rounded-3xl opacity-80"
                             />
                        </div>
                    </div>

                    {/* Floating Info Cards */}
                    <div className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl animate-bounce duration-[3000ms]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Success Rate</p>
                                <p className="text-xl font-bold">99.9% Accuracy</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-8 py-24 border-t border-slate-200 dark:border-slate-800">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold mb-4">Everything you need to manage attendance</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">One platform to track, report, and analyze student presence with zero fraud possibilities.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="glass p-10 rounded-[32px] hover:border-primary-500/30 transition-all group">
                            <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                <f.icon className="text-white" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                        <Globe size={16} className="text-white dark:text-slate-900" />
                    </div>
                    <span className="font-bold">AttendX Global</span>
                </div>
                <p className="text-slate-500 text-sm">© 2024 Smart Attendance Management System. All rights reserved.</p>
                <div className="flex gap-6 text-sm font-medium text-slate-500">
                    <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
