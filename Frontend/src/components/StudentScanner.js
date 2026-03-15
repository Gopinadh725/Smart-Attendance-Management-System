import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';

const StudentScanner = () => {
    const [message, setMessage] = useState('');

    const handleScan = async (result) => {
        if (result) {
            try {
                const token = result[0].rawValue; // Get token from QR 
                const res = await axios.post('/api/attendance/scan', { token }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setMessage(res.data.message);
            } catch (err) {
                setMessage(err.response?.data?.message || "Scan failed");
            }
        }
    };

    return (
        <div className="scanner-container">
            <h2>Scan Faculty QR Code</h2>
            <div style={{ width: '300px', margin: '0 auto' }}>
                <Scanner onScan={handleScan} allowMultiple={false} />
            </div>
            {message && <p className={`mt-4 ${message.includes('success') ? 'text-green' : 'text-red'}`}>{message}</p>}
        </div>
    );
};