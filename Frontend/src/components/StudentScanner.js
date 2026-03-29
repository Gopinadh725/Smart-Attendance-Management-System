import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { getDeviceId } from '../utils/getDeviceId';
import toast from 'react-hot-toast'; // Assuming you added Toast!

const StudentScanner = () => {
    const [isScanning, setIsScanning] = useState(true);

    const handleScan = async (result) => {
        if (result && isScanning) {
            setIsScanning(false); // Pause scanner to prevent multiple rapid api calls
            try {
                const token = result[0].rawValue;
                const deviceId = await getDeviceId();

                const res = await axios.post('/api/attendance/scan', { token, currentDeviceId: deviceId }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                toast.success(res.data.message || "Attendance Marked!");
                
            } catch (err) {
                toast.error(err.response?.data?.message || "Invalid QR Code");
                // Allow scanning again after an error
                setTimeout(() => setIsScanning(true), 3000); 
            }
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Scan to Mark Attendance</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                Center the QR code inside the frame.
            </p>
            
            {/* Responsive Wrapper */}
            <div style={scannerWrapperStyle}>
                {isScanning ? (
                    <Scanner onScan={handleScan} />
                ) : (
                    <div style={successBoxStyle}>
                        <div style={{ fontSize: '50px' }}>✅</div>
                        <h3>Scan Processed</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CSS Styles for Mobile Responsiveness ---
const containerStyle = {
    maxWidth: '500px', // Prevents it from getting too wide on laptops
    margin: '0 auto',  // Centers it on the page
    padding: '20px',
};

const scannerWrapperStyle = {
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden', // Keeps the camera feed inside the rounded borders
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    backgroundColor: '#000', // Black background while camera loads
    aspectRatio: '1 / 1', // Keeps it a perfect square on mobile
};

const successBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#d4edda',
    color: '#155724'
};

export default StudentScanner;