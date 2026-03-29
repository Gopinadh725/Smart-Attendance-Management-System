import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const QRScannerPage = () => {
    const [scanned, setScanned] = useState(false);
    const [marking, setMarking] = useState(false);
    const [scanData, setScanData] = useState(null);

    const handleScan = async (result) => {
        if (!result || scanned || marking) return;

        setMarking(true);
        try {
            const token = result[0].rawValue;
            const res = await api.post('/qr/scan', { token });
            setScanData({
                subjectName: res.data.subjectName,
                section: res.data.section
            });
            setScanned(true);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid QR code');
            setScanned(false);
        } finally {
            setMarking(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8 animate-fade-in min-h-screen">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeft className="dark:text-white" />
                </Link>
                <h1 className="text-3xl font-bold dark:text-white">QR Attendance</h1>
            </div>

            {!scanned ? (
                <div className="glass p-8 rounded-[40px] space-y-8 overflow-hidden shadow-xl border border-white/20">
                    <div className="text-center space-y-2">
                        <div className="inline-block p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 mb-2">
                            <Camera size={40} />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">Scan the QR Code</h2>
                        <p className="text-slate-500">Align the code inside the camera view below</p>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-500/20 aspect-square max-w-sm mx-auto">
                        <Scanner
                            onScan={handleScan}
                            allowMultiple={false}
                            constraints={{ facingMode: 'environment' }}
                        />
                        <div className="absolute inset-0 border-2 border-indigo-500/50 pointer-events-none m-8 rounded-2xl border-dashed animate-pulse" />
                    </div>

                    <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse">
                        Scanning for Active Session...
                    </p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="glass p-12 rounded-[40px] text-center space-y-8 shadow-2xl border border-emerald-500/20"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                        <div className="relative inline-block p-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-full text-emerald-600">
                            <CheckCircle size={80} />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Attendance Marked!</h2>
                        <div className="py-6 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Subject</p>
                            <p className="text-2xl font-bold text-indigo-600">{scanData?.subjectName}</p>
                            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-tighter">Section {scanData?.section} • Today</p>
                        </div>
                        <p className="text-slate-500 font-medium pt-2">Your presence has been successfully synchronized with the cloud.</p>
                    </div>

                    <Link 
                        to="/dashboard"
                        className="inline-block bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all w-full text-lg"
                    >
                        Back to Dashboard
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default QRScannerPage;
